// Step 1: parse the PDFs with LlamaParse and save them as Markdown files
import LlamaCloud from '@llamaindex/llama-cloud';
import { readdir, writeFile, mkdir } from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import { join, basename } from 'path';
import { loadEnv, PDFS_DIR, PARSED_DIR, explain } from './common.js';

loadEnv(['LLAMA_CLOUD_API_KEY']);

const llama = new LlamaCloud(); // reads LLAMA_CLOUD_API_KEY from the environment

async function parsePDF(filePath) {
  const result = await llama.parsing.parse({
    tier: 'cost_effective',
    version: 'latest',
    upload_file: createReadStream(filePath),
    expand: ['markdown'],
  });

  // LlamaParse returns one Markdown text per page. We join them into one document.
  return result.markdown.pages
    .filter((page) => page.success)
    .map((page) => page.markdown)
    .join('\n\n');
}

try {
  await mkdir(PARSED_DIR, { recursive: true });

  const pdfs = (await readdir(PDFS_DIR)).filter((file) => file.endsWith('.pdf'));
  console.log(`Found ${pdfs.length} PDFs\n`);

  for (const pdf of pdfs) {
    const outputFile = join(PARSED_DIR, basename(pdf, '.pdf') + '.md');

    // Parsing costs credits, so we don't parse again a PDF that we already parsed
    if (existsSync(outputFile)) {
      console.log(`Skipped (already parsed): ${pdf}`);
      continue;
    }

    console.log(`Parsing: ${pdf}`);
    const markdown = await parsePDF(join(PDFS_DIR, pdf));
    await writeFile(outputFile, markdown, 'utf-8');
    console.log(`Saved: ${basename(outputFile)}`);
  }

  console.log('\nAll documents parsed');
} catch (error) {
  console.error(`\nSomething failed: ${explain(error)}`);
  process.exit(1);
}
