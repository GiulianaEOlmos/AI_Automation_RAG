// Demo 05: evaluate the basic RAG vs the advanced RAG with a golden dataset
// Before running it: "npm run demo:02:index" and "npm run demo:04:index"
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { CohereError } from 'cohere-ai';
import {
  loadEnv, createOpenAI, createQdrant, explain, COLLECTION_NAME,
} from '../02-parse-and-index/common.js';

loadEnv(['OPENAI_API_KEY', 'QDRANT_URL', 'COHERE_API_KEY']);

// We import the pipelines after loading the .env, because they create the clients
const { basicRag, advancedRag, CHAT_MODEL, HYBRID_COLLECTION } = await import('./pipelines.js');

const __dirname = dirname(fileURLToPath(import.meta.url));
const openai = createOpenAI();
const qdrant = createQdrant();

// Retrieval metric: is the expected document in the chunks that we got?
function retrievalHit(item, chunks) {
  if (!item.expectedSource) return null; // questions that are not in the documents
  return chunks.some((chunk) => chunk.payload.source === item.expectedSource);
}

// Generation metrics: an LLM as a judge, with structured outputs (week 2)
const judgeSchema = {
  type: 'object',
  properties: {
    correctness: { type: 'integer', description: 'From 1 to 5: does the answer match the expected answer?' },
    faithfulness: { type: 'integer', description: 'From 1 to 5: is the answer based only on the context?' },
    answerRelevance: { type: 'integer', description: 'From 1 to 5: does the answer respond to the question?' },
    reason: { type: 'string', description: 'One short sentence explaining the scores' },
  },
  required: ['correctness', 'faithfulness', 'answerRelevance', 'reason'],
  additionalProperties: false,
};

async function judge(item, answer, chunks) {
  const context = chunks.map((chunk) => chunk.payload.text).join('\n\n') || '(no context)';

  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: 'system',
        content: `You evaluate the answers of a RAG system. Give scores from 1 (very bad) to 5 (perfect).
- correctness: compare the answer with the expected answer.
- faithfulness: the answer only uses information from the context. Saying "I don't have enough information" is faithful.
- answerRelevance: the answer responds to the question.`,
      },
      {
        role: 'user',
        content: `Question: ${item.question}\n\nExpected answer: ${item.expectedAnswer}\n\nContext:\n${context}\n\nAnswer: ${answer}`,
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'evaluation', strict: true, schema: judgeSchema },
    },
  });

  return JSON.parse(response.choices[0].message.content);
}

async function evaluate(name, rag, dataset) {
  console.log(`\n===== ${name} =====`);
  const results = [];

  for (const item of dataset) {
    const { answer, chunks } = await rag(item.question);
    const hit = retrievalHit(item, chunks);
    const scores = await judge(item, answer, chunks);

    const hitLabel = hit === null ? '  -  ' : hit ? ' yes ' : ' NO  ';
    console.log(`[retrieval: ${hitLabel}] C:${scores.correctness} F:${scores.faithfulness} R:${scores.answerRelevance} — ${item.question}`);

    results.push({ question: item.question, answer, sources: chunks.map((c) => c.payload.source), hit, ...scores });
  }

  return results;
}

function summary(results) {
  const withSource = results.filter((r) => r.hit !== null);
  const average = (key) => (results.reduce((sum, r) => sum + r[key], 0) / results.length).toFixed(2);

  return {
    'Retrieval (expected doc in top 3)': `${withSource.filter((r) => r.hit).length}/${withSource.length}`,
    'Correctness (1-5)': average('correctness'),
    'Faithfulness (1-5)': average('faithfulness'),
    'Answer relevance (1-5)': average('answerRelevance'),
  };
}

try {
  for (const collection of [COLLECTION_NAME, HYBRID_COLLECTION]) {
    const { exists } = await qdrant.collectionExists(collection);
    if (!exists) {
      console.error(`The collection "${collection}" does not exist. Run "npm run demo:02:index" and "npm run demo:04:index" first.`);
      process.exit(1);
    }
  }

  const dataset = JSON.parse(await readFile(join(__dirname, 'golden-dataset.json'), 'utf-8'));
  console.log(`Golden dataset: ${dataset.length} questions`);

  const basic = await evaluate('Basic RAG', basicRag, dataset);
  const advanced = await evaluate('Advanced RAG', advancedRag, dataset);

  const basicSummary = summary(basic);
  const advancedSummary = summary(advanced);

  console.log('\n===== Summary =====');
  console.log(`${'Metric'.padEnd(36)}${'Basic'.padEnd(10)}Advanced`);
  for (const metric of Object.keys(basicSummary)) {
    console.log(`${metric.padEnd(36)}${basicSummary[metric].padEnd(10)}${advancedSummary[metric]}`);
  }

  // All the details (answers, sources, reasons) are saved here, to check them by hand
  await writeFile(join(__dirname, 'results.json'), JSON.stringify({ basic, advanced }, null, 2));
  console.log('Details saved in RAG/05-evals/results.json');
} catch (error) {
  if (error instanceof CohereError && error.statusCode === 401) {
    console.error('\nSomething failed: Cohere rejected your API key. Check COHERE_API_KEY in your .env.');
  } else {
    console.error(`\nSomething failed: ${explain(error)}`);
  }
  process.exit(1);
}
