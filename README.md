# AI_Automation_RAG

Code for my dev.to series about AI and automation.

- [`n8n/`](./n8n): the job finder workflow. Import the JSON in your n8n.
- [`RAG/`](./RAG): RAG demos with Node.js, OpenAI and Qdrant.

## Run the RAG demos

You need:
- **Node.js 22 or newer** (check it with `node -v`)
- An **OpenAI API key**
- A **Qdrant** database: a free cluster in [Qdrant Cloud](https://cloud.qdrant.io/), or local with `docker run -p 6333:6333 qdrant/qdrant`
- Only for demo 02 (optional): a **LlamaParse API key** from [cloud.llamaindex.ai](https://cloud.llamaindex.ai)
- Only for demo 04: a **Cohere API key** from [dashboard.cohere.com](https://dashboard.cohere.com/api-keys)

```bash
git clone https://github.com/GiulianaEOlmos/AI_Automation_RAG.git
cd AI_Automation_RAG
npm install
cp .env.example .env    # then open .env and add your keys
npm run demo:01
```

### 01 · Semantic search

[`RAG/01-semantic-search`](./RAG/01-semantic-search/index.js) saves 5 small texts in Qdrant and searches the most similar ones for two questions. You can run it as many times as you want.

### 02 · Parse and index real documents

[`RAG/02-parse-and-index`](./RAG/02-parse-and-index) takes 10 PDFs (my Technical Interview Prep series), parses them with [LlamaParse](https://cloud.llamaindex.ai), splits them into chunks, and saves them in Qdrant. It has 3 steps:

```bash
npm run demo:02:parse    # PDFs -> Markdown (needs LLAMA_CLOUD_API_KEY in your .env)
npm run demo:02:index    # Markdown -> chunks -> embeddings -> Qdrant
npm run demo:02:search   # semantic search over the documents
```

The parsed Markdown files are already in `RAG/02-parse-and-index/parsed`, so you can skip the first step if you don't want to create a LlamaParse account. If you want to parse them again, delete that folder first.

### 03 · Complete RAG

[`RAG/03-full-rag`](./RAG/03-full-rag/rag.js) uses the documents from demo 02 to answer questions with an LLM: it searches the most relevant chunks in Qdrant, builds a prompt with them, and the LLM answers using only that context. Run demo 02 first (at least `npm run demo:02:index`).

```bash
npm run demo:03
```

### 04 · Advanced RAG

[`RAG/04-advanced-rag`](./RAG/04-advanced-rag/rag-advanced.js) improves demo 03 with HyDE, hybrid search (semantic search + BM25, joined with RRF) and re-ranking with [Cohere](https://dashboard.cohere.com/api-keys). It needs a `COHERE_API_KEY` in your `.env`.

BM25 needs one more vector for each chunk, so this demo creates its own collection (`interview-prep-hybrid`) with the parsed documents from demo 02:

```bash
npm run demo:04:index    # run once: creates the hybrid collection
npm run demo:04
```

### 05 · Evals

[`RAG/05-evals`](./RAG/05-evals/evals.js) compares the basic RAG (demo 03) with the advanced RAG (demo 04), using a [golden dataset](./RAG/05-evals/golden-dataset.json) of 12 questions about the documents. For each answer it measures if the expected document was retrieved, and uses an LLM as a judge to score correctness, faithfulness and answer relevance. Run demos 02 and 04 first (at least `npm run demo:02:index` and `npm run demo:04:index`).

```bash
npm run demo:05
```

The details of each answer are saved in `RAG/05-evals/results.json`.

## If something fails

- **`Unsupported engine`** when you run `npm install`: your Node version is too old. Install Node 22 or newer from [nodejs.org](https://nodejs.org/) (or with nvm: `nvm install 24`).
- **`Missing .env file`** or **`Missing ... in your .env file`**: create the `.env` with `cp .env.example .env` and complete it.
- **`401` / `Incorrect API key`**: check `OPENAI_API_KEY`.
- **`LlamaParse rejected your API key`**: check `LLAMA_CLOUD_API_KEY`.
- **`Cohere rejected your API key`**: check `COHERE_API_KEY`.
- **`Unauthorized` / `fetch failed`** with Qdrant: check `QDRANT_URL` and `QDRANT_API_KEY`. If you use Docker, check that it's running.
