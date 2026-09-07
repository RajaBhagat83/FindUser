
const dotenv = require("dotenv");
dotenv.config();

const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { Pinecone } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("@langchain/pinecone");
const path = require("path");



async function indexDocs() {
const PDF_PATH = path.join(__dirname, "../StoreFile/Ragpdf.pdf");
  // 1. Load PDF
  const pdfloader = new PDFLoader(PDF_PATH);

  const rawdocs = await pdfloader.load();

  console.log("PDF loaded");

  // 2. Split PDF into chunks
  const textsplitters = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunkedDocs = await textsplitters.splitDocuments(rawdocs);

  console.log("Chunking completed");

  // 3. Configure embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });

  console.log("Embedding configured");

  // 4. Configure Pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const pineconeIndex = pinecone.Index(
    process.env.PINECONE_INDEX_NAME
  );

  console.log("Pinecone configured");

  // 5. Store documents in Pinecone
  await PineconeStore.fromDocuments(
    chunkedDocs,
    embeddings,
    {
      pineconeIndex,
      maxConcurrency: 5,
    }
  );

  console.log("Data stored successfully");
}

// Run function
indexDocs();

