// Demo 03: the complete RAG (Retrieval + Augmented + Generation)
// It uses the "interview-prep" collection that we created in demo 02,
// so run "npm run demo:02:index" first.
import {
  loadEnv, createOpenAI, createQdrant, getEmbeddings, explain, COLLECTION_NAME,
} from '../02-parse-and-index/common.js';

loadEnv(['OPENAI_API_KEY', 'QDRANT_URL']);

const openai = createOpenAI();
const qdrant = createQdrant();

const CHAT_MODEL = 'gpt-6-luna';
const TOP_K = 3;        // How many chunks to retrieve from Qdrant
const MIN_SCORE = 0.4;  // Minimum score to consider a chunk relevant

// Retrieval: searches Qdrant for the most relevant chunks to the question.
// Filters out the chunks below MIN_SCORE, so we don't pass irrelevant context to the LLM.
async function retrieveChunks(question) {
  const [questionVector] = await getEmbeddings(openai, [question]);

  const { points } = await qdrant.query(COLLECTION_NAME, {
    query: questionVector,
    limit: TOP_K,
    with_payload: true,
  });

  return points.filter((point) => point.score >= MIN_SCORE);
}

// Augmented (context engineering): builds the prompt with the chunks.
// Qdrant returns the chunks ordered by score, so the most relevant one goes first (lost in the middle).
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

// Generation: sends the prompt to the LLM and returns the answer
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

// The complete RAG: retrieve -> build the prompt -> generate
async function rag(question) {
  console.log(`\nQuestion: "${question}"`);
  console.log('─'.repeat(60));

  const chunks = await retrieveChunks(question);

  if (chunks.length === 0) {
    console.log(`No relevant chunks found (all the scores are below ${MIN_SCORE}).`);
    console.log("\nAnswer:\nI don't have enough information to answer that.");
    return;
  }

  console.log(`Retrieved ${chunks.length} chunks:`);
  chunks.forEach((chunk, i) => {
    console.log(`  ${i + 1}. Score: ${chunk.score.toFixed(3)} — ${chunk.payload.source}`);
  });

  const prompt = buildPrompt(question, chunks);
  const answer = await generate(prompt);

  console.log(`\nAnswer:\n${answer}`);
}

try {
  const { exists } = await qdrant.collectionExists(COLLECTION_NAME);
  if (!exists) {
    console.error('The collection does not exist. Run "npm run demo:02:index" first.');
    process.exit(1);
  }

  await rag('What is the difference between arrow functions and regular functions?');
  await rag('How does Node.js handle asynchronous code?');
  await rag('What is the best pizza in Italy?');
} catch (error) {
  console.error(`\nSomething failed: ${explain(error)}`);
  process.exit(1);
}
