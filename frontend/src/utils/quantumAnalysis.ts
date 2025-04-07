import { QuantumAnalysisResult } from '../types/quantum';

// Run quantum analysis using actual quantum algorithms via API
export async function runQuantumAnalysis(text: string, algorithm: string): Promise<QuantumAnalysisResult> {
  try {
    const response = await fetch('http://localhost:3000/api/quantum/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        algorithm,
        text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Quantum analysis error:', errorData);
      throw new Error(
        errorData.details 
          ? `Quantum analysis failed: ${errorData.details}`
          : errorData.error 
            ? `Quantum analysis failed: ${errorData.error}`
            : 'Unknown error occurred'
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error running quantum analysis:', error);
    throw error;
  }
}