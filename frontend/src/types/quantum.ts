export interface QuantumAnalysisResult {
  algorithm: string;
  keySize: number;
  numberToFactor?: number;
  perfectQuantum: {
    successRate: number;
    timeToBreak: number;
    vulnerabilityScore: number;
  };
  currentQuantum: {
    successRate: number;
    timeToBreak: number;
    vulnerabilityScore: number;
  };
  quantumAdvantage: {
    perfect: number;
    current: number;
  };
  note: string;
} 