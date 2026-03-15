import mammoth from "mammoth";
import express from "express";
import multer from "multer";
import cors from "cors";
import { pipeline } from "@xenova/transformers";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // ✅ Correct ESM import

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Load SBERT model
let embedder;
(async () => {
  console.log("⏳ Loading SBERT model...");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("✅ SBERT Model Loaded");

  app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
})();

// Mean Pooling
function meanPool(tokenVectors) {
  const dimension = tokenVectors[0].length;
  const result = new Array(dimension).fill(0);
  for (const token of tokenVectors) {
    for (let i = 0; i < dimension; i++) {
      result[i] += token[i];
    }
  }
  return result.map(v => v / tokenVectors.length);
}

// Get embedding
async function getEmbedding(text) {
  const output = await embedder(text, {
    pooling: "mean",
    normalize: true
  });

  return Array.from(output.data);
}

// Extract text from PDF or DOCX/DOC
async function extractText(file) {
  try {
    const ext = path.extname(file.originalname).toLowerCase();
    const data = file.buffer; // ✅ Use buffer directly

    if (ext === ".pdf") {
      console.log("Processing PDF:", file.originalname);
      const pdfData = await pdfParse(data);
      return pdfData.text;
    } else if (ext === ".docx" || ext === ".doc") {
      console.log("Processing DOCX/DOC:", file.originalname);
      const result = await mammoth.extractRawText({ buffer: data });
      return result.value;
    } else {
      throw new Error("Unsupported file type: " + file.originalname);
    }
  } catch (err) {
    console.error("Error extracting text from", file.originalname, err);
    return "";
  }
}

// Cosine similarity
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB) return 0;

  const dot = vecA.reduce((sum, v, i) => sum + v * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(vecB.reduce((sum, v) => sum + v * v, 0));

  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}


// Upload API
app.post("/upload", upload.array("resumes"), async (req, res) => {
  try {
    const jobDesc = req.body.jobDescription;
    const files = req.files;

    if (!jobDesc || !files?.length) {
      return res.status(400).json({ error: "Missing job description or resumes" });
    }

    const jobEmbedding = await getEmbedding(jobDesc);
    const results = [];

    for (const file of files) {
      const text = await extractText(file);
      console.log("Extracted text preview:", text.slice(0,200));
      if (!text) {
        console.log("Skipping file (empty text):", file.originalname);
        continue;
      }

      const resumeEmbedding = await getEmbedding(text);
      let score = cosineSimilarity(jobEmbedding, resumeEmbedding);
      if (isNaN(score)) score = 0;
      results.push({
        name: file.originalname.replace(/\.(pdf|docx|doc)$/i, ""),
        score: Number((score * 100).toFixed(2)),
      });
    }

    results.sort((a, b) => b.score - a.score);
    res.json({ ranked_resumes: results });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

