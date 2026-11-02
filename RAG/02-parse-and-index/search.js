// Step 3: semantic search over the indexed documents
import {
  loadEnv, createOpenAI, createQdrant, getEmbeddings, explain, COLLECTION_NAME,
} from './common.js';

loadEnv(['OPENAI_API_KEY', 'QDRANT_URL']);

const openai = createOpenAI();
const qdrant = createQdrant();

async function search(question) {
  const [questionVector] = await getEmbeddings(openai, [question]);

  const { points } = await qdrant.query(COLLECTION_NAME, {
    query: questionVector,
    limit: 3, // top-k
    with_payload: true,
  });

  console.log(`\nQuestion: "${question}"`);
  console.log('─'.repeat(60));
  points.forEach((point, i) => {
    const preview = point.payload.text.replace(/\s+/g, ' ').slice(0, 200);
    console.log(`\n${i + 1}. Score: ${point.score.toFixed(3)} — ${point.payload.source}`);
    console.log(`   ${preview}...`);
  });
}

try {
  const { exists } = await qdrant.collectionExists(COLLECTION_NAME);
  if (!exists) {
    console.error('The collection does not exist. Run "npm run demo:02:index" first.');
    process.exit(1);
  }

  await search('What is the difference between arrow functions and regular functions?');
  await search('How does Node.js handle asynchronous code?');
  await search('How should I answer behavioral questions in an interview?');
} catch (error) {
  console.error(`\nSomething failed: ${explain(error)}`);
  process.exit(1);
}
