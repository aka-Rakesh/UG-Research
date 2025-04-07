import express, { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router = express.Router();

interface AnalysisRequest {
  algorithm: string;
  keySize?: number;
}

interface QuantumResult {
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
}

interface AnalysisResponse {
  algorithm: string;
  keySize: number;
  numberToFactor?: number;
  perfectQuantum: QuantumResult['perfectQuantum'];
  currentQuantum: QuantumResult['currentQuantum'];
  quantumAdvantage: QuantumResult['quantumAdvantage'];
  note: string;
}

router.post('/analyze', async (req: Request<{}, {}, AnalysisRequest>, res: Response) => {
  try {
    const { algorithm, keySize = 256 } = req.body;
    
    // Validate input
    if (!algorithm) {
      return res.status(400).json({ error: 'Algorithm is required' });
    }

    // Path to the Python script
    const scriptPath = path.join(__dirname, '../../quantum/run_analysis.py');
    
    console.log(`Running quantum analysis for algorithm: ${algorithm}, keySize: ${keySize}`);
    console.log(`Python script path: ${scriptPath}`);
    
    // Spawn Python process with error handling
    const pythonProcess = spawn('python', [scriptPath, algorithm, keySize.toString()], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let resultData = '';
    let errorData = '';
    
    // Collect data from stdout
    pythonProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      console.log('Python stdout:', chunk);
      resultData += chunk;
    });
    
    // Collect data from stderr
    pythonProcess.stderr.on('data', (data) => {
      const chunk = data.toString();
      console.error('Python stderr:', chunk);
      errorData += chunk;
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      
      if (code !== 0) {
        console.error('Python script error:', errorData);
        return res.status(500).json({ 
          error: 'Quantum analysis failed',
          details: errorData || 'Unknown error occurred',
          code: code
        });
      }
      
      try {
        // Try to parse the result
        const result = JSON.parse(resultData);
        console.log('Analysis result:', result);
        res.json(result);
      } catch (error) {
        console.error('Failed to parse result:', error);
        console.error('Raw result data:', resultData);
        res.status(500).json({ 
          error: 'Failed to parse quantum analysis results',
          details: error instanceof Error ? error.message : 'Unknown parsing error',
          rawData: resultData
        });
      }
    });
    
    // Handle process errors
    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      res.status(500).json({ 
        error: 'Failed to run quantum analysis',
        details: error.message
      });
    });
    
    // Handle request timeout
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      res.status(500).json({ 
        error: 'Quantum analysis timed out',
        details: 'Analysis took too long to complete'
      });
    }, 30000); // 30 second timeout
    
    // Clear timeout on completion
    pythonProcess.on('close', () => clearTimeout(timeout));
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown server error'
    });
  }
});

export default router; 