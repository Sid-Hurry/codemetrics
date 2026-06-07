const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

// Load Passport Configuration
const passport = require('./config/passport');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const historyRoutes = require('./routes/historyRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const comparisonsRoutes = require('./routes/comparisonsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');

const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// 1. Security headers & CORS settings
app.use(helmet({
  contentSecurityPolicy: false // Allow swagger assets to load cleanly
}));

app.use(cors({
  origin: '*', // Allow frontend requests. In production, swap with process.env.FRONTEND_URL
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

// 5. Initialize Passport Authentication
app.use(passport.initialize());

// 6. Swagger/OpenAPI setup
const PORT = process.env.PORT || 5000;
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeMetrics AI API',
      version: '2.0.0',
      description: 'AI-Powered Developer Analytics Platform Node.js API powered by Express, MySQL, and Google Gemini.',
      contact: {
        name: 'Developer Support',
        email: 'support@codemetrics.dev'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './backend/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 7. Route bindings
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/comparisons', comparisonsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', profileRoutes); // Covers /api/analyze/:username and /api/profiles

// Base route redirection to swagger docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// 8. Global centralized error handler
app.use(errorHandler);

module.exports = app;
