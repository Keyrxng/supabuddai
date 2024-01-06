"use client";
import React, { useState } from "react";

const TestExecution: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);

  const runTests = () => {
    // Logic to run tests and update log
  };

  return (
    <div className="space-y-4">
      <button
        onClick={runTests}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Run Tests
      </button>
      <div className="log-viewer h-64 overflow-auto border border-gray-300 p-4">
        {log.map((entry, index) => (
          <div key={index} className="text-gray-700">
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestExecution;
