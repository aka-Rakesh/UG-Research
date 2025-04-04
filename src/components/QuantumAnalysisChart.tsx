import React from 'react';
import { QuantumAnalysisResult } from '../utils/quantumAnalysis';

interface Props {
  result: QuantumAnalysisResult;
}

export const QuantumAnalysisChart: React.FC<Props> = ({ result }) => {
  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Quantum Analysis Results</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>Success Rate</span>
            <span>{result.successRate}%</span>
          </div>
          <div className="w-full h-2 bg-gray-600 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${result.successRate}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Vulnerability Score</span>
            <span>{result.vulnerabilityScore}/100</span>
          </div>
          <div className="w-full h-2 bg-gray-600 rounded-full">
            <div
              className="h-full rounded-full"
              style={{
                width: `${result.vulnerabilityScore}%`,
                backgroundColor: `hsl(${120 - (result.vulnerabilityScore * 1.2)}, 100%, 50%)`
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Time to Break</div>
            <div className="text-xl font-semibold">
              {result.timeToBreak < 1000 
                ? `${result.timeToBreak} seconds`
                : '> 1000 seconds'}
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Quantum Advantage</div>
            <div className="text-xl font-semibold">
              {result.quantumAdvantage}x faster
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};