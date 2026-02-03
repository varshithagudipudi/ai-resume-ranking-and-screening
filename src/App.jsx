import React, { useState } from "react";
import UploadZone from "./components/UploadZone.jsx";
import Results from "./components/Results.jsx";

export default function App() {
  const [results, setResults] = useState(null);

  const handleAnalyze = async (files, jobDesc) => {
    if (!files.length || !jobDesc.trim()) {
      alert("Please upload at least one resume and enter a job description!");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("resumes", file));
    formData.append("jobDescription", jobDesc);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Backend response:", data); 
      if (data.error) {
        alert(`Error: ${data.error}`);
        setResults(null);
      } else {
        setResults(data);
      }
    } catch (error) {
      console.error("❌ Backend error:", error);
      alert("Failed to connect to backend. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-10">
      <div className="bg-white/70 backdrop-blur-lg w-full max-w-3xl rounded-2xl shadow-2xl p-8 border border-white/30">
        {!results ? (
          <>
            <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
              AI Resume Ranking
            </h1>
            <UploadZone onAnalyze={handleAnalyze} />
          </>
        ) : (
          <>
            <button
              onClick={() => setResults(null)}
              className="mb-4 bg-white/60 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow"
            >
              ← Back
            </button>
            <Results results={results} />
          </>
        )}
      </div>
    </div>
  );
}

