// Demo 04: Advanced RAG
// HyDE -> Hybrid search -> Re-ranking -> Context engineering -> Generation
// Before running it: "npm run demo:04:index"
import { CohereClient, CohereError } from 'cohere-ai';
import {
  loadEnv, createOpenAI, createQdrant, getEmbeddings, explain,
} from '../02-parse-and-index/common.js';

loadEnv(['OPENAI_API_KEY', 'QDRANT_URL', 'COHERE_API_KEY']);

const openai = createOpenAI();
const qdrant = createQdrant();
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

const CHAT_MODEL = 'gpt-6-luna';
const HYBRID_COLLECTION = 'interview-prep-hybrid'; // created by index-hybrid.js

// Step 1 — HyDE
// Instead of embedding the question directly, we ask the LLM to generate
// a hypothetical answer and embed that instead. A hypothetical answer is
// structurally closer to the real chunks than a question is.
async function hyde(question) {
  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: 'system', content: 'Generate a short expert answer to the question. Be specific and concise.' },
      { role: 'user', content: question },
    ],
  });

  const hypotheticalAnswer = response.choices[0].message.content;
  console.log(`Hypothetical answer: "${hypotheticalAnswer.slice(0, 100)}..."`);

  const [vector] = await getEmbeddings(openai, [hypotheticalAnswer]);
  return vector;
}

// Step 2 — Hybrid search
// Qdrant runs 2 searches and joins both rankings with Reciprocal Rank Fusion (RRF):
//   - semantic search with the HyDE vector
//   - keyword search (BM25) with the original question
async function hybridSearch(question, hydeVector) {
  const { points } = await qdrant.query(HYBRID_COLLECTION, {
    prefetch: [
      // Semantic search — uses the HyDE vector
      { query: hydeVector, using: 'dense', limit: 20 },
      // Keyword search (BM25) — uses the original question. Qdrant creates the BM25 vector.
      { query: { text: question, model: 'Qdrant/bm25' }, using: 'bm25', limit: 20 },
    ],
    query: { fusion: 'rrf' }, // joins both rankings
    limit: 10,
    with_payload: true,
  });

  return points;
}

// Step 3 — Re-ranking
// Cohere analyzes the question and each chunk TOGETHER as text,
// not as vectors. This produces a more precise relevance ranking.
async function rerank(question, chunks) {
  const reranked = await cohere.rerank({
    model: 'rerank-english-v3.0',
    query: question,
    documents: chunks.map((chunk) => chunk.payload.text),
    topN: 3,
  });

  return reranked.results.map((result) => ({
    score: result.relevanceScore,
    payload: chunks[result.index].payload,
  }));
}

// Step 4 — Context engineering
// Builds the prompt with the re-ranked chunks as context.
// Most relevant chunks go first to avoid the lost-in-the-middle effect.
function buildPrompt(question, chunks) {
  const context = chunks
    .map((chunk, i) => `[Source ${i + 1}: ${chunk.payload.source}]\n${chunk.payload.text}`)
    .join('\n\n');

  return {
    system: `You are an assistant that helps people prepare for technical interviews.
Answer the questions based ONLY on the provided context.
If the answer is not in the context, say "I don't have enough information to answer that."
Be concise and precise.`,
    user: `Context:\n${context}\n\nQuestion: ${question}`,
  };
}

// Step 5 — Generation
async function generate(prompt) {
  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
  });
  return response.choices[0].message.content;
}

// Full advanced RAG pipeline
async function ragAdvanced(question) {
  console.log(`\nQuestion: "${question}"`);
  console.log('─'.repeat(60));

  const hydeVector = await hyde(question);

  const chunks = await hybridSearch(question, hydeVector);
  console.log(`Retrieved ${chunks.length} chunks from hybrid search`);

  const rerankedChunks = await rerank(question, chunks);
  console.log('Top 3 after re-ranking:');
  rerankedChunks.forEach((chunk, i) => {
    console.log(`  ${i + 1}. Score: ${chunk.score.toFixed(3)} — ${chunk.payload.source}`);
  });

  const prompt = buildPrompt(question, rerankedChunks);
  const answer = await generate(prompt);
  console.log(`\nAnswer:\n${answer}`);
}

try {
  const { exists } = await qdrant.collectionExists(HYBRID_COLLECTION);
  if (!exists) {
    console.error('The hybrid collection does not exist. Run "npm run demo:04:index" first.');
    process.exit(1);
  }

  await ragAdvanced('How does Node.js handle asynchronous code?');
  await ragAdvanced('STAR method');
  await ragAdvanced('Promise.allSettled');
} catch (error) {
  if (error instanceof CohereError && error.statusCode === 401) {
    console.error('\nSomething failed: Cohere rejected your API key. Check COHERE_API_KEY in your .env.');
  } else {
    console.error(`\nSomething failed: ${explain(error)}`);
  }
  process.exit(1);
}
