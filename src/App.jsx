import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import RingLoader from "react-spinners/RingLoader";
import { Code, FileCheck, ZapIcon } from "lucide-react";

const App = () => {
  const options = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "typescript", label: "TypeScript" },
    { value: "rust", label: "Rust" },
    { value: "dart", label: "Dart" },
    { value: "scala", label: "Scala" },
    { value: "perl", label: "Perl" },
    { value: "haskell", label: "Haskell" },
    { value: "elixir", label: "Elixir" },
    { value: "r", label: "R" },
    { value: "matlab", label: "MATLAB" },
    { value: "bash", label: "Bash" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#18181b",
      borderColor: "#3f3f46",
      borderRadius: "8px",
      color: "#fff",
      width: "100%",
      padding: "2px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#18181b",
      color: "#fff",
      width: "100%",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
      width: "100%",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#3f3f46" : "#18181b",
      color: "#fff",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    }),
    input: (provided) => ({
      ...provided,
      color: "#fff",
      width: "100%",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a1a1aa",
      width: "100%",
    }),
  };

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  // Initialize AI with environment variable
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  async function reviewCode() {
    if (code.trim() === "") {
      setResponse("⚠️ Please enter some code to review.");
      return;
    }

    setResponse("");
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I'm sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue.

Analyze it like a senior developer reviewing a pull request.

Code: ${code}
`,
      });
      setResponse(response.text);
    } catch (error) {
      setResponse("⚠️ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fixCode() {
    if (code.trim() === "") {
      setResponse("⚠️ Please enter some code to fix.");
      return;
    }

    setResponse("");
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I'm sharing a piece of code written in ${selectedOption.value} that may contain issues or can be improved.
Please fix this code by:

1️⃣ Correcting any syntax errors or bugs
2️⃣ Improving code quality and readability
3️⃣ Applying best practices for ${selectedOption.value}
4️⃣ Optimizing performance where possible
5️⃣ Ensuring the code follows modern standards

Return ONLY the complete fixed code without any explanations or markdown formatting.
Original Code: ${code}`,
      });
      setResponse(
        "```" + selectedOption.value + "\n" + response.text + "\n```"
      );
    } catch (error) {
      setResponse("⚠️ Error generating fixed code: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <Navbar />
      <div className="flex flex-2 px-4 overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 flex flex-col p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Select
                value={selectedOption}
                onChange={setSelectedOption}
                options={options}
                styles={customStyles}
                className="min-w-64"
              />
            </div>

            <div className="flex items-center gap-4 px-4 mx-4">
              <button
                onClick={fixCode}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 hover:translate-y-0.5 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                <FileCheck size={18} className="text-indigo-200" />
                <span>Fix Code</span>
              </button>
              <button
                onClick={reviewCode}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30 hover:translate-y-0.5 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                <Code size={18} className="text-purple-200" />
                <span>Review</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden border border-zinc-800 rounded-lg shadow-lg">
            <Editor
              height="100%"
              theme="vs-dark"
              language={selectedOption.value}
              value={code}
              onChange={setCode}
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
              }}
            />
          </div>
        </div>

        {/* Right Panel - Response */}
        <div className="w-1/2 flex flex-col bg-zinc-900 border-l border-zinc-800">
          <div className="flex items-center px-6 py-3 border-b border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2">
              <ZapIcon size={20} className="text-purple-400" />
              <h2 className="text-lg font-semibold text-white">AI Response</h2>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <RingLoader color="#9333ea" size={60} />
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <Markdown>{response}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
