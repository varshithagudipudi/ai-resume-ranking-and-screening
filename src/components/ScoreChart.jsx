import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ScoreChart = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={results}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="score" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoreChart;

