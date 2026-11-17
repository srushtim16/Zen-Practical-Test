import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Fetch all products
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// Fetch next invoice number
export const getNextInvoiceNo = async () => {
  const response = await api.get('/invoices/next-number');
  return response.data;
};

// Create a new invoice
export const createInvoice = async (invoiceData) => {
  const response = await api.post('/invoices', invoiceData);
  return response.data;
};

// Fetch all saved invoices (history)
export const getInvoices = async () => {
  const response = await api.get('/invoices');
  return response.data;
};

export default api;

