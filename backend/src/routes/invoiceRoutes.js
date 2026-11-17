const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/next-number', invoiceController.getNextInvoiceNo);
router.get('/', invoiceController.getAllInvoices);
router.post('/', invoiceController.createInvoice);

module.exports = router;

