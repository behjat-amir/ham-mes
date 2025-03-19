const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const swaggerConfig = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const apiKeyRoutes = require('./routes/apiKey.routes');
const messageRoutes = require('./routes/message.routes');
const systemRoutes = require('./routes/system.routes');
const { authorizeFileAccess } = require('./middlewares/fileAccess');

// Create Express app
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.disable('x-powered-by');

// Database
connectDB();

// Swagger
swaggerConfig(app);

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiKeyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/system', systemRoutes);

// File download
app.get('/download/:filename', authorizeFileAccess, (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  
  res.download(filePath, err => {
    if (err) res.status(500).json({ error: 'Download failed' });
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app; 