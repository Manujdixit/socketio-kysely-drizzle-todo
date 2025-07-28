import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Live Collaborative Todo API is running',
    timestamp: new Date().toISOString()
  });
});

router.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API routes not implemented yet' });
});

export default router;