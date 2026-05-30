const app = require('./app');
const { testConnection, pool } = require('./config/db');
const { initializeDatabase } = require('./services/dbService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Starting CodeMetrics API server...');

    // 1. Dynamic Database Check and Table Provisioning
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error('⚠️ Database setup failed. Proceeding, but connection might fail...');
    }

    // 2. Validate DB pool connectivity
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn('⚠️ Server starting without successful database verification. Ensure MySQL is running.');
    }

    // 3. Launch HTTP listener
    const server = app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`✅ Server is running in ${process.env.NODE_ENV || 'development'} mode.`);
      console.log(`📡 Listening on: http://localhost:${PORT}`);
      console.log(`📘 Swagger API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`===================================================`);
    });

    // 4. Graceful Shutdown handlers
    const shutdown = async () => {
      console.log('🔄 Shutdown signal received. Closing HTTP server and database pools...');
      
      server.close(async () => {
        console.log('🔒 HTTP server closed.');
        try {
          await pool.end();
          console.log('🔒 MySQL connection pools closed.');
          process.exit(0);
        } catch (err) {
          console.error(`Error closing database pools during shutdown: ${err.message}`);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('💥 Fatal error during server startup sequence:', error);
    process.exit(1);
  }
};

startServer();
