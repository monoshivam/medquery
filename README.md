# MedQuery
 
A RAG-based clinical report analyser. Upload a lab report or clinical diagnosis as an image, and ask the AI questions about it — it'll flag abnormal values, explain findings, and answer queries grounded in real clinical reference data.
 
## How it works
 
1. Upload your clinical report as an image
2. Gemini vision reads the report and extracts a structured summary
3. That summary is embedded and used to query a Pinecone vector store loaded with clinical reference documents
4. Relevant clinical findings are retrieved and passed alongside your question to Gemini, which generates a grounded answer
## Stack
 
- **Next.js** — frontend + API routes
- **Google Gemini** (`@google/genai`) — vision for report parsing, text generation for Q&A
- **Pinecone** — vector database for clinical reference retrieval
- **Xenova Transformers** (`mixedbread-ai/mxbai-embed-large-v1`) — local embedding model, runs on your machine
- **Tailwind CSS + shadcn/ui** — UI components
## Getting Started
 
### 1. Clone and install
 
```bash
git clone https://github.com/monoshivam/medrag-uni.git
cd medrag-uni
npm install
```
 
### 2. Set up environment variables
 
Create a `.env.local` file in the root:
 
```bash
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
```
 
### 3. Run the dev server
 
```bash
npm run dev
```
 
Open [http://localhost:3000](http://localhost:3000).
 
## Environment Variables
 
| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `PINECONE_API_KEY` | Pinecone API key |
 
## Notes
 
- The embedding model runs locally — no HuggingFace API key needed
- Make sure your Pinecone index is named `index-one` with namespace `testspace`
- The vector store should be pre-loaded with clinical reference PDFs before querying
