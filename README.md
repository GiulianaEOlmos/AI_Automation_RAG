# AI_Automation_RAG

Code for my dev.to series about AI and automation.

- [`n8n/`](./n8n): the job finder workflow. Import the JSON in your n8n.
- [`RAG/`](./RAG): RAG demos with Node.js, OpenAI and Qdrant.

## Run the RAG demos

You need:
- **Node.js 22 or newer** (check it with `node -v`)
- An **OpenAI API key**
- A **Qdrant** database: a free cluster in [Qdrant Cloud](https://cloud.qdrant.io/), or local with `docker run -p 6333:6333 qdrant/qdrant`

```bash
git clone https://github.com/GiulianaEOlmos/AI_Automation_RAG.git
cd AI_Automation_RAG
npm install
cp .env.example .env    # then open .env and add your keys
npm run demo:01
```

### 01 · Semantic search

[`RAG/01-semantic-search`](./RAG/01-semantic-search/index.js) saves 5 small texts in Qdrant and searches the most similar ones for two questions. You can run it as many times as you want.

## If something fails

- **`Unsupported engine`** when you run `npm install`: your Node version is too old. Install Node 22 or newer from [nodejs.org](https://nodejs.org/) (or with nvm: `nvm install 24`).
- **`Missing .env file`** or **`Missing ... in your .env file`**: create the `.env` with `cp .env.example .env` and complete it.
- **`401` / `Incorrect API key`**: check `OPENAI_API_KEY`.
- **`Unauthorized` / `fetch failed`** with Qdrant: check `QDRANT_URL` and `QDRANT_API_KEY`. If you use Docker, check that it's running.
