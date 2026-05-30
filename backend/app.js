const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

const profileRoutes = require('./routes/profileRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// 1. Security headers & CORS settings
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP slightly to avoid restricting external Swagger/API layouts
}));
app.use(cors({
  origin: '*', // In production, replace with specific React frontend origins (e.g., http://localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Performance & Compression middlewares
app.use(compression());

// 3. API Logging
app.use(morgan('dev'));

// 4. Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Swagger/OpenAPI setup
const PORT = process.env.PORT || 5000;
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GitHub Profile Analyzer API',
      version: '1.0.0',
      description: 'Production-ready Node.js API to fetch and analyze GitHub profiles, compute customized developer scores, and store details in a MySQL DB.',
      contact: {
        name: 'Developer Support',
        email: 'internship@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local Development Server'
      }
    ]
  },
  apis: ['./routes/*.js', './backend/routes/*.js'] // Cover multiple path styles depending on run directories
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. API Route bindings
app.use('/api', profileRoutes);

// Base route redirection to swagger docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// 7. Global centralized error handler
app.use(errorHandler);

module.exports = app;
