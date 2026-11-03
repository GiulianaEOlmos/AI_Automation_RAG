// Run once (after demo 02 parsed the PDFs):
// creates a new collection for hybrid search, with 2 vectors for each chunk:
//   - dense: the embedding from OpenAI (for the semantic search)
//   - bm25: a BM25 vector that Qdrant creates from the text (for the keyword search)
import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import {
  loadEnv, createOpenAI, createQdrant, getEmbeddings, explain,
  PARSED_DIR, VECTOR_SIZE,
} from '../02-parse-and-index/common.js';

loadEnv(['OPENAI_API_KEY', 'QDRANT_URL']);

const openai = createOpenAI();
const qdrant = createQdrant();

const HYBRID_COLLECTION = 'interview-prep-hybrid';
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;

// The same fixed-size chunking from demo 02
function chunkText(text, chunkSize, overlap) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

try {
  const files = existsSync(PARSED_DIR)
    ? (await readdir(PARSED_DIR)).filter((file) => file.endsWith('.md'))
    : [];
  if (files.length === 0) {
    console.error('No parsed documents found. Run "npm run demo:02:parse" first.');
    process.exit(1);
  }

  // If the collection already exists (from a previous run), delete it and start again
  const { exists } = await qdrant.collectionExists(HYBRID_COLLECTION);
  if (exists) {
    await qdrant.deleteCollection(HYBRID_COLLECTION);
  }

  await qdrant.createCollection(HYBRID_COLLECTION, {
    vectors: {
      dense: { size: VECTOR_SIZE, distance: 'Cosine' },
    },
    sparse_vectors: {
      bm25: { modifier: 'idf' }, // idf: common words count less
    },
  });
  console.log(`Collection "${HYBRID_COLLECTION}" created\n`);

  let nextId = 0;
  let total = 0;

  for (const file of files) {
    const text = await readFile(join(PARSED_DIR, file), 'utf-8');
    const chunks = chunkText(text, CHUNK_SIZE, CHUNK_OVERLAP);
    const vectors = await getEmbeddings(openai, chunks);

    const points = chunks.map((chunk, i) => ({
      id: nextId++,
      vector: {
        dense: vectors[i],
        // We send the text, and Qdrant creates the BM25 vector
        bm25: { text: chunk, model: 'Qdrant/bm25' },
      },
      payload: {
        text: chunk,
        source: file,
        chunkIndex: i,
      },
    }));

    await qdrant.upsert(HYBRID_COLLECTION, { wait: true, points });
    console.log(`${file}: ${chunks.length} chunks saved`);
    total += chunks.length;
  }

  console.log(`\n${total} chunks saved from ${files.length} documents`);
} catch (error) {
  console.error(`\nSomething failed: ${explain(error)}`);
  process.exit(1);
}
