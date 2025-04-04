import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import { encryptMessage } from './utils/encryption';
import { runQuantumAnalysis, QuantumAnalysisResult } from './utils/quantumAnalysis';
import { QuantumAnalysisChart } from './components/QuantumAnalysisChart';

// Simplified encryption categories focusing on quantum-vulnerable algorithms
const encryptionCategories = [
  {
    name: "Classical Encryption",
    algorithms: ["SHA-256", "AES"]
  },
  {
    name: "Public-Key Cryptography",
    algorithms: ["ECDSA", "RSA"]
  }
];

const sampleMessages = [
  "The quick brown fox jumps over the lazy dog",
  "Blockchain technology is revolutionizing the world",
  "Decentralization is the future of finance",
  "Web3 is changing how we interact with the internet",
  "Cryptocurrency enables borderless transactions"
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>(encryptionCategories[0].name);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(encryptionCategories[0].algorithms[0]);
  const [message, setMessage] = useState<string>("");
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<QuantumAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    generateNewMessage();
  }, []);

  const generateNewMessage = () => {
    const newMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    setMessage(newMessage);
    runAnalysis(newMessage, selectedAlgorithm);
  };

  const runAnalysis = async (text: string, algorithm: string) => {
    setIsAnalyzing(true);
    try {
      const encrypted = await encryptMessage(text, algorithm);
      setEncryptedText(encrypted);
      
      const result = await runQuantumAnalysis(text, algorithm);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newAlgorithm = encryptionCategories.find(c => c.name === category)?.algorithms[0] || "";
    setSelectedAlgorithm(newAlgorithm);
    runAnalysis(message, newAlgorithm);
  };

  const handleAlgorithmChange = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    runAnalysis(message, algorithm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Quantum Security Analysis</h1>
          <p className="text-gray-300">Analyzing Web3 encryption against quantum algorithms</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full bg-gray-700 rounded-md p-2 text-white"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {encryptionCategories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Algorithm</label>
              <select
                className="w-full bg-gray-700 rounded-md p-2 text-white"
                value={selectedAlgorithm}
                onChange={(e) => handleAlgorithmChange(e.target.value)}
              >
                {encryptionCategories
                  .find((c) => c.name === selectedCategory)
                  ?.algorithms.map((algorithm) => (
                    <option key={algorithm} value={algorithm}>
                      {algorithm}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Test Message
                </h3>
                <button
                  onClick={generateNewMessage}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New
                </button>
              </div>
              <p className="text-gray-300 font-mono">{message}</p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Encrypted Text
              </h3>
              <p className="text-gray-300 font-mono break-all">{encryptedText}</p>
            </div>

            {isAnalyzing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="mt-4">Running quantum analysis...</p>
              </div>
            ) : analysisResult && (
              <QuantumAnalysisChart result={analysisResult} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;