import OpenAI from 'openai';
import { QdrantClient } from '@qdrant/js-client-rest';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

// Load the variables from the .env file in the root of the repo
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../../.env');
if (!existsSync(envPath)) {
  console.error('Missing .env file. Copy .env.example to .env and complete it.');
  process.exit(1);
}
process.loadEnvFile(envPath);

for (const name of ['OPENAI_API_KEY', 'QDRANT_URL']) {
  if (!process.env[name]) {
    console.error(`Missing ${name} in your .env file.`);
    process.exit(1);
  }
}

const openai = new OpenAI(); // reads OPENAI_API_KEY from the environment
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY || undefined, // empty when you use Qdrant locally
  checkCompatibility: false,
});

const COLLECTION_NAME = 'demo-rag';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const VECTOR_SIZE = 1536; // text-embedding-3-small returns vectors of 1536 numbers

const chunks = [
  'Employees are entitled to 15 vacation days per year.',
  'Working hours are from 9am to 6pm, Monday through Friday.',
  'The onboarding process lasts two weeks for all new employees.',
  'Employees can work remotely up to 3 days per week.',
  'Health insurance covers the employee and their immediate family.',
];

// Converts a list of texts into vectors with one single API call
async function getEmbeddings(texts) {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return response.data.map((item) => item.embedding);
}

// Phase 1: prepare the documents
async function setup() {
  // If the collection already exists (from a previous run), delete it and start again
  const { exists } = await qdrant.collectionExists(COLLECTION_NAME);
  if (exists) {
    await qdrant.deleteCollection(COLLECTION_NAME);
  }

  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: VECTOR_SIZE, distance: 'Cosine' },
  });
  console.log('Collection created');

  const vectors = await getEmbeddings(chunks);

  const points = chunks.map((chunk, i) => ({
    id: i,
    vector: vectors[i],
    payload: { text: chunk },
  }));

  // wait: true -> Qdrant answers when the points are ready to be searched
  await qdrant.upsert(COLLECTION_NAME, { wait: true, points });
  console.log(`${chunks.length} chunks saved`);
}

// Phase 2: answer a question (semantic search)
async function search(question) {
  const [questionVector] = await getEmbeddings([question]);

  const { points } = await qdrant.query(COLLECTION_NAME, {
    query: questionVector,
    limit: 2, // top-k
    with_payload: true,
  });

  console.log(`\nQuestion: "${question}"`);
  console.log('Most relevant chunks:');
  points.forEach((point, i) => {
    console.log(`${i + 1}. Score: ${point.score.toFixed(3)} — ${point.payload.text}`);
  });
}

try {
  await setup();
  await search('How many days off do I get per year?');
  await search('Can I work from home?');
} catch (error) {
  console.error(`\nSomething failed: ${explain(error)}`);
  process.exit(1);
}

// Turns the most common errors into a clear message
function explain(error) {
  if (error instanceof OpenAI.APIConnectionError) {
    return "can't connect to OpenAI. Check your internet connection.";
  }
  if (error instanceof OpenAI.AuthenticationError) {
    return 'OpenAI rejected your API key. Check OPENAI_API_KEY in your .env.';
  }
  // Any other connection error comes from Qdrant ("fetch failed")
  if (error.message === 'fetch failed') {
    const reason = error.cause?.code || error.cause?.message || 'unknown';
    return `can't connect to Qdrant at ${process.env.QDRANT_URL} (reason: ${reason}).
Check QDRANT_URL in your .env. If you use Qdrant Cloud, check in the dashboard that your cluster is running.
If you use Docker, check that Qdrant is running.`;
  }
  if (error.status === 401 || error.status === 403) {
    return 'Qdrant rejected the request. Check QDRANT_API_KEY in your .env.';
  }
  return error.message;
}
