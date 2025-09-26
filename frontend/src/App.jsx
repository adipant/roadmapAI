import React from "react";
import { useState } from "react";
import Footer from "./components/Footer";

const App = () => {
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRoadmap = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setRoadmap([]);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://roadmap-ai-backend-three.vercel.app/api/generate-roadmap",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json(response);
      setRoadmap(data);
    } catch (error) {
      console.error("API error", error);
      setError(error.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-grow p-4 sm:p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          AI Roadmap Generator
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Enter your learning goal and get a customized roadmap.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="e.g., Learn Quantum Computing"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateRoadmap()}
            className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 w-full"
          />
          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 shadow-lg shadow-purple-600/30 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>

        {error && <div className="text-center text-red-400 mb-4">{error}</div>}

        <div className="space-y-6">
          {roadmap.map((step, index) => (
            <div
              key={step.id || index}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start sm:items-center mb-4">
                <span className="bg-purple-600 text-white text-xl font-bold rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center mr-4">
                  {index + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-100">
                  {step?.title}
                </h2>
              </div>
              <div className="pl-14">
                <p className="text-gray-400 mb-3">{step?.description}</p>
                {step?.estimated_time && (
                  <p className="text-sm text-purple-400 font-medium">
                    Est. Time: {step?.estimated_time}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
