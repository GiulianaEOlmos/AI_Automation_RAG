// The two RAGs that we compare: the basic one (demo 03) and the advanced one (demo 04).
// Same logic as those demos, but each function returns the answer and the chunks,
// so we can evaluate them.
import { CohereClient } from 'cohere-ai';
import {
  createOpenAI, createQdrant, getEmbeddings, COLLECTION_NAME,
} from '../02-parse-and-index/common.js';

export const CHAT_MODEL = 'gpt-6-luna';
export const HYBRID_COLLECTION = 'interview-prep-hybrid';
const NO_INFO = "I don't have enough information to answer that.";

const openai = createOpenAI();
const qdrant = createQdrant();
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

function buildPrompt(question, chunks) {
  const context = chunks
    .map((chunk, i) => `[Source ${i + 1}: ${chunk.payload.source}]\n${chunk.payload.text}`)
    .join('\n\n');

  return {
    system: `You are an assistant that helps people prepare for technical interviews.
Answer the questions based ONLY on the provided context.
If the answer is not in the context, say "${NO_INFO}"
Be concise and precise.`,
    user: `Context:\n${context}\n\nQuestion: ${question}`,
  };
}

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

// Basic RAG (demo 03): semantic search + minimum score + generation
export async function basicRag(question) {
  const [questionVector] = await getEmbeddings(openai, [question]);

  const { points } = await qdrant.query(COLLECTION_NAME, {
    query: questionVector,
    limit: 3,
    with_payload: true,
  });
  const chunks = points.filter((point) => point.score >= 0.4);

  if (chunks.length === 0) {
    return { answer: NO_INFO, chunks };
  }

  const answer = await generate(buildPrompt(question, chunks));
  return { answer, chunks };
}

// Advanced RAG (demo 04): HyDE + hybrid search + re-ranking + generation
export async function advancedRag(question) {
  // HyDE
  const hydeResponse = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: 'system', content: 'Generate a short expert answer to the question. Be specific and concise.' },
      { role: 'user', content: question },
    ],
  });
  const [hydeVector] = await getEmbeddings(openai, [hydeResponse.choices[0].message.content]);

  // Hybrid search
  const { points } = await qdrant.query(HYBRID_COLLECTION, {
    prefetch: [
      { query: hydeVector, using: 'dense', limit: 20 },
      { query: { text: question, model: 'Qdrant/bm25' }, using: 'bm25', limit: 20 },
    ],
    query: { fusion: 'rrf' },
    limit: 10,
    with_payload: true,
  });

  // Re-ranking
  const reranked = await cohere.rerank({
    model: 'rerank-english-v3.0',
    query: question,
    documents: points.map((point) => point.payload.text),
    topN: 3,
  });
  const chunks = reranked.results.map((result) => ({
    score: result.relevanceScore,
    payload: points[result.index].payload,
  }));

  const answer = await generate(buildPrompt(question, chunks));
  return { answer, chunks };
}
