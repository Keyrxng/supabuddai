"use client";
import React, { useState } from "react";

const ProjectSelector: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(event.target.value);
  };

  return (
    <select
      value={selectedProject}
      onChange={handleChange}
      className="block w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    >
      {/* Map your project list here */}
    </select>
  );
};

export default ProjectSelector;
