import React, { useState, useEffect } from 'react';
import { Lock, Unlock, RefreshCw, Eye } from 'lucide-react';
import { encryptMessage } from './utils/encryption';

type EncryptionCategory = {
  name: string;
  algorithms: string[];
};

const encryptionCategories: EncryptionCategory[] = [
  {
    name: "Hashing Algorithms",
    algorithms: ["SHA-256", "Keccak-256", "RIPEMD-160"]
  },
  {
    name: "Public-Key Cryptography",
    algorithms: ["ECDSA", "EdDSA", "RSA"]
  },
  {
    name: "Symmetric Encryption",
    algorithms: ["AES"]
  },
  {
    name: "Zero-Knowledge Proofs",
    algorithms: ["zk-SNARKs", "zk-STARKs"]
  },
  {
    name: "Homomorphic Encryption",
    algorithms: ["Fully Homomorphic"]
  },
  {
    name: "Secure Multi-Party Computation",
    algorithms: ["SMPC"]
  },
  {
    name: "Threshold Cryptography",
    algorithms: ["Shamir's Secret Sharing"]
  }
];

const sampleSentences = [
  "The quick brown fox jumps over the lazy dog",
  "Blockchain technology is revolutionizing the world",
  "Decentralization is the future of finance",
  "Web3 is changing how we interact with the internet",
  "Cryptocurrency enables borderless transactions"
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>(encryptionCategories[0].name);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(encryptionCategories[0].algorithms[0]);
  const [originalText, setOriginalText] = useState<string>("");
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [userGuess, setUserGuess] = useState<string>("");
  const [similarity, setSimilarity] = useState<number>(0);
  const [hasGuessed, setHasGuessed] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  useEffect(() => {
    generateNewSentence();
  }, []);

  const generateNewSentence = () => {
    const randomIndex = Math.floor(Math.random() * sampleSentences.length);
    const newSentence = sampleSentences[randomIndex];
    setOriginalText(newSentence);
    encryptText(newSentence);
    setUserGuess("");
    setSimilarity(0);
    setHasGuessed(false);
    setShowOriginal(false);
  };

  const encryptText = async (text: string) => {
    const encrypted = await encryptMessage(text, selectedAlgorithm);
    setEncryptedText(encrypted);
  };

  const calculateSimilarity = () => {
    const original = originalText.toLowerCase();
    const guess = userGuess.toLowerCase();
    
    let matches = 0;
    const words1 = original.split(' ');
    const words2 = guess.split(' ');
    
    words1.forEach((word, index) => {
      if (words2[index] === word) matches++;
    });
    
    const similarity = (matches / words1.length) * 100;
    setSimilarity(Math.round(similarity));
    setHasGuessed(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedAlgorithm(encryptionCategories.find(c => c.name === category)?.algorithms[0] || "");
    encryptText(originalText);
  };

  const handleAlgorithmChange = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    encryptText(originalText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Web3 Encryption Showcase</h1>
          <p className="text-gray-300">Explore different encryption techniques used in Web3</p>
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
            {(hasGuessed || showOriginal) && (
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Original Text
                  </h3>
                  <button
                    onClick={generateNewSentence}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New
                  </button>
                </div>
                <p className="text-gray-300 font-mono">{originalText}</p>
              </div>
            )}

            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Encrypted Text
              </h3>
              <p className="text-gray-300 font-mono break-all">{encryptedText}</p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Unlock className="w-5 h-5 mr-2" />
                  Try to Guess the Original Text
                </h3>
                <button
                  onClick={() => setShowOriginal(true)}
                  className="flex items-center bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-md"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Reveal Original
                </button>
              </div>
              <input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onBlur={calculateSimilarity}
                className="w-full bg-gray-600 p-3 rounded-md text-white mb-4"
                placeholder="Enter your guess here..."
              />
              {hasGuessed && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    Similarity: {similarity}%
                  </span>
                  <div className="w-64 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${similarity}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;