import express from 'express';
import { createServer } from 'http';
import { config } from './config';
import { setupMiddleware, errorHandler, notFoundHandler } from './middleware';
import { setupSocketIO } from './socket';
import routes from './routes';

const app = express();
const server = createServer(app);

// Setup middleware
setupMiddleware(app);

// Setup routes
app.use('/', routes);

// Setup Socket.IO
const io = setupSocketIO(server);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(notFoundHandler);

server.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📡 Socket.IO server ready for connections`);
  console.log(`🌍 CORS enabled for: ${config.corsOrigin}`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { app, server, io };