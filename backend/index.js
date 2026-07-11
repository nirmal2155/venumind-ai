const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`VenueMind Backend running on http://localhost:${port}`);
});

// --- Graceful Shutdown Handler ---
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force close after 10s if connections persist
  setTimeout(() => {
    console.error('Forced shutdown: active connections did not terminate in time.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// --- Process Crash Prevention ---
process.on('uncaughtException', (err) => {
  console.error('FATAL: Uncaught Exception:', err);
  // Log err to server logs, then exit gracefully
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('FATAL: Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // Keep process alive or exit depending on severity, but log always
});
