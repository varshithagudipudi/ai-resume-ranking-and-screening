import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadZone({ onAnalyze }) {
  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles]),
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyzeClick = () => {
    onAnalyze(files, jobDesc);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`p-6 rounded-xl border-2 border-dashed transition cursor-pointer text-center 
          ${isDragActive ? "border-purple-600 bg-purple-50" : "border-gray-400 bg-white/50"}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {files.length
            ? "Selected files: " + files.map((f) => f.name).join(", ")
            : "Drag & drop resumes here, or click to select"}
        </p>
      </div>

      {/* List of selected files with remove option */}
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white/70 px-4 py-2 rounded-lg shadow"
            >
              <span>{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 font-bold hover:text-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Job description textarea */}
      <textarea
        placeholder="Paste job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        className="w-full mt-2 p-4 border rounded-xl bg-white/60 backdrop-blur-sm"
        rows={5}
      />

      {/* Analyze button */}
      <button
        onClick={handleAnalyzeClick}
        className="w-full mt-4 py-3 rounded-xl text-white font-semibold shadow-lg 
          bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-transform hover:scale-[1.02]"
      >
        🚀 Analyze Resumes
      </button>
    </div>
  );
}



