// Things that the 3 scripts of this demo share: the .env, the clients and the config
import OpenAI from 'openai';
import LlamaCloud from '@llamaindex/llama-cloud';
import { QdrantClient } from '@qdrant/js-client-rest';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PDFS_DIR = join(__dirname, 'pdfs');
export const PARSED_DIR = join(__dirname, 'parsed');
export const COLLECTION_NAME = 'interview-prep';
export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const VECTOR_SIZE = 1536; // text-embedding-3-small returns vectors of 1536 numbers

// Loads the .env from the root of the repo and checks the variables that the script needs
export function loadEnv(requiredVars) {
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  if (nodeMajor < 22) {
    console.error(`You are using Node ${process.versions.node}. This demo needs Node 22 or newer (check it with "node -v").`);
    process.exit(1);
  }
  const envPath = resolve(__dirname, '../../.env');
  if (!existsSync(envPath)) {
    console.error('Missing .env file. Copy .env.example to .env and complete it.');
    process.exit(1);
  }
  process.loadEnvFile(envPath);

  for (const name of requiredVars) {
    if (!process.env[name]) {
      console.error(`Missing ${name} in your .env file.`);
      process.exit(1);
    }
  }
}

export function createOpenAI() {
  return new OpenAI(); // reads OPENAI_API_KEY from the environment
}

export function createQdrant() {
  return new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY || undefined, // empty when you use Qdrant locally
    checkCompatibility: false,
  });
}

// Converts a list of texts into vectors with one single API call
export async function getEmbeddings(openai, texts) {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return response.data.map((item) => item.embedding);
}

// Turns the most common errors into a clear message
export function explain(error) {
  if (error instanceof OpenAI.APIConnectionError) {
    return "can't connect to OpenAI. Check your internet connection.";
  }
  if (error instanceof OpenAI.AuthenticationError) {
    return 'OpenAI rejected your API key. Check OPENAI_API_KEY in your .env.';
  }
  if (error instanceof LlamaCloud.APIConnectionError) {
    return "can't connect to LlamaParse. Check your internet connection.";
  }
  if (error instanceof LlamaCloud.AuthenticationError) {
    return 'LlamaParse rejected your API key. Check LLAMA_CLOUD_API_KEY in your .env.';
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
