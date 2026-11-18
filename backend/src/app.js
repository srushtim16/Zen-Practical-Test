const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Zen Practical API',
    version: '1.0.0',
    description: 'API for product lookup and invoice management.'
  },
  servers: [{ url: '/' }],
  tags: [
    { name: 'Health' },
    { name: 'Products' },
    { name: 'Invoices' }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        responses: {
          200: {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'OK' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        responses: {
          200: { description: 'Products returned successfully' },
          500: { description: 'Failed to fetch products' }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a product by ID',
        parameters: [{
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }],
        responses: {
          200: { description: 'Product returned successfully' },
          404: { description: 'Product not found' },
          500: { description: 'Failed to fetch product details' }
        }
      }
    },
    '/api/invoices/next-number': {
      get: {
        tags: ['Invoices'],
        summary: 'Get the next invoice number',
        responses: {
          200: { description: 'Next invoice number returned successfully' },
          500: { description: 'Failed to determine the next invoice number' }
        }
      }
    },
    '/api/invoices': {
      get: {
        tags: ['Invoices'],
        summary: 'List invoices with their details',
        responses: {
          200: { description: 'Invoices returned successfully' },
          500: { description: 'Failed to fetch invoices' }
        }
      },
      post: {
        tags: ['Invoices'],
        summary: 'Create an invoice',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['CustomerName', 'items'],
                properties: {
                  CustomerName: { type: 'string', example: 'A. Customer' },
                  items: {
                    type: 'array',
                    minItems: 1,
                    items: {
                      type: 'object',
                      required: ['Product_Id', 'Rate', 'Unit', 'Qty'],
                      properties: {
                        Product_Id: { type: 'integer', example: 1 },
                        Rate: { type: 'number', example: 100 },
                        Unit: { type: 'string', example: 'pcs' },
                        Qty: { type: 'number', example: 2 },
                        Disc_Percentage: { type: 'number', example: 5 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Invoice created successfully' },
          400: { description: 'Invalid customer or invoice item data' },
          500: { description: 'Failed to save invoice' }
        }
      }
    }
  }
};

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Interactive API documentation and OpenAPI specification
app.get('/api-docs.json', (req, res) => res.json(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

