import { encryptMessage } from './encryption';

// Simulated quantum analysis results based on our simplified quantum algorithms
export interface QuantumAnalysisResult {
  algorithm: string;
  timeToBreak: number;  // simulated time in seconds
  successRate: number;  // percentage
  quantumAdvantage: number;  // factor of improvement over classical
  vulnerabilityScore: number;  // 0-100
}

// Simulate quantum algorithm performance against different encryption methods
export const runQuantumAnalysis = async (message: string, algorithm: string): Promise<QuantumAnalysisResult> => {
  const encrypted = await encryptMessage(message, algorithm);
  
  // Simplified analysis based on algorithm characteristics
  switch (algorithm) {
    case 'SHA-256':
      return {
        algorithm,
        timeToBreak: 2 ** 128, // Grover's algorithm theoretical speedup
        successRate: 85,
        quantumAdvantage: 2,
        vulnerabilityScore: 40
      };
    
    case 'ECDSA':
      return {
        algorithm,
        timeToBreak: 300, // Shor's algorithm theoretical break
        successRate: 95,
        quantumAdvantage: 1000000,
        vulnerabilityScore: 90
      };
    
    case 'RSA':
      return {
        algorithm,
        timeToBreak: 200,
        successRate: 98,
        quantumAdvantage: 1000000,
        vulnerabilityScore: 95
      };
    
    case 'AES':
      return {
        algorithm,
        timeToBreak: 2 ** 64, // Grover's algorithm theoretical speedup
        successRate: 75,
        quantumAdvantage: 2,
        vulnerabilityScore: 30
      };
    
    default:
      return {
        algorithm,
        timeToBreak: 1000,
        successRate: 50,
        quantumAdvantage: 10,
        vulnerabilityScore: 60
      };
  }
};