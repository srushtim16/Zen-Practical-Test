const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

module.exports = app;
