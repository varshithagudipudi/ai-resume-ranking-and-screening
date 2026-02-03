import React from "react";

export default function JobDescription({ jobDesc, setJobDesc }) {
  return (
    <textarea
      value={jobDesc}
      onChange={(e) => setJobDesc(e.target.value)}
      placeholder="Enter Job Description..."
      className="w-full h-32 p-2 border border-gray-300 rounded mt-4"
    />
  );
}
