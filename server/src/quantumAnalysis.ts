import express, { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router = express.Router();

interface AnalysisRequest {
  algorithm: string;
  keySize?: number;
}

router.post('/analyze', async (req: Request<{}, {}, AnalysisRequest>, res: Response) => {
  try {
    const { algorithm, keySize = 256 } = req.body;
    
    // Path to the Python script
    const scriptPath = path.join(__dirname, '../../quantum/run_analysis.py');
    
    // Spawn Python process
    const pythonProcess = spawn('python', [scriptPath, algorithm, keySize.toString()]);
    
    let resultData = '';
    let errorData = '';
    
    // Collect data from stdout
    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });
    
    // Collect data from stderr
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        console.error('Error output:', errorData);
        res.status(500).json({ error: `Quantum analysis failed: ${errorData}` });
        return;
      }
      
      try {
        const result = JSON.parse(resultData);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: `Failed to parse quantum analysis results: ${error}` });
      }
    });
    
    // Handle process errors
    pythonProcess.on('error', (error) => {
      res.status(500).json({ error: `Failed to run quantum analysis: ${error}` });
    });
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error}` });
  }
});

export default router; 