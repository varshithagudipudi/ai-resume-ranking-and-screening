import React from "react";

export default function Results({ results }) {
  const ranked = results?.ranked_resumes || [];

  const getRankIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "📄";
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Ranked Resumes
      </h2>

      <div className="space-y-4">
        {ranked.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 rounded-xl shadow-md border bg-white"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getRankIcon(index)}</span>
              <span className="font-medium text-lg">{item.name}</span>
            </div>

            <div className="px-3 py-1 rounded-lg font-semibold bg-blue-500 text-white">
              {item.score}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


