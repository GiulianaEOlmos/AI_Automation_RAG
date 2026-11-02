// Step 2: split the Markdown files into chunks, create the embeddings and save them in Qdrant
import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import {
  loadEnv, createOpenAI, createQdrant, getEmbeddings, explain,
  PARSED_DIR, COLLECTION_NAME, VECTOR_SIZE,
} from './common.js';

loadEnv(['OPENAI_API_KEY', 'QDRANT_URL']);

const openai = createOpenAI();
const qdrant = createQdrant();

const CHUNK_SIZE = 500;    // characters
const CHUNK_OVERLAP = 100; // characters shared between two consecutive chunks

// Fixed-size chunking: cuts the text every CHUNK_SIZE characters,
// and each new chunk starts CHUNK_OVERLAP characters before the end of the previous one
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
  const { exists } = await qdrant.collectionExists(COLLECTION_NAME);
  if (exists) {
    await qdrant.deleteCollection(COLLECTION_NAME);
  }
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: VECTOR_SIZE, distance: 'Cosine' },
  });
  console.log(`Collection "${COLLECTION_NAME}" created\n`);

  let nextId = 0;
  let total = 0;

  for (const file of files) {
    const text = await readFile(join(PARSED_DIR, file), 'utf-8');
    const chunks = chunkText(text, CHUNK_SIZE, CHUNK_OVERLAP);
    const vectors = await getEmbeddings(openai, chunks);

    const points = chunks.map((chunk, i) => ({
      id: nextId++,
      vector: vectors[i],
      payload: {
        text: chunk,
        source: file,  // which document the chunk comes from
        chunkIndex: i, // position of the chunk inside the document
      },
    }));

    await qdrant.upsert(COLLECTION_NAME, { wait: true, points });
    console.log(`${file}: ${chunks.length} chunks saved`);
    total += chunks.length;
  }

  console.log(`\n${total} chunks saved from ${files.length} documents`);
} catch (error) {
  console.error(`\nSomething failed: ${explain(error)}`);
  process.exit(1);
}
