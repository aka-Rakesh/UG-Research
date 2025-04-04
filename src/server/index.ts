import express from 'express';
import cors from 'cors';
import quantumAnalysisRouter from './quantumAnalysis';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quantum', quantumAnalysisRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 