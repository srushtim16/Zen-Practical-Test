import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Snackbar,
  InputAdornment,
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import {
  AddCircle as AddCircleOutlineIcon,
  Delete as DeleteOutlineIcon,
  CheckCircle as CheckCircleOutlineIcon,
  Person as PersonOutlineIcon,
  Percent as PercentIcon,
  Numbers as NumbersIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Lock as LockIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';

import { getProducts, createInvoice } from '../services/api';

const InvoiceFormMui = ({ onInvoiceSaved }) => {
  // Master fields
  const [customerName, setCustomerName] = useState('');
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Line item input fields
  const [selectedProductId, setSelectedProductId] = useState('');
  const [rate, setRate] = useState('');
  const [unit, setUnit] = useState('');
  const [qty, setQty] = useState('');
  const [discPercent, setDiscPercent] = useState('0');
  const [netAmount, setNetAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  // Field validation errors
  const [errors, setErrors] = useState({
    customerName: '',
    product: '',
    qty: '',
    discPercent: ''
  });

  // Touched state for immediate feedback
  const [touched, setTouched] = useState({
    customerName: false,
    product: false,
    qty: false,
    discPercent: false
  });

  // In-memory Grid items
  const [gridItems, setGridItems] = useState([]);

  // Notifications
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await getProducts();
      if (res && res.data) {
        setProductsList(res.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setToast({
        open: true,
        message: 'Could not load products. Please check if backend is running.',
        severity: 'error'
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  // Field validators
  const validateCustomerName = (val) => {
    if (!val || val.trim() === '') return 'Customer Name is required.';
    if (val.trim().length < 3) return 'Customer Name must be at least 3 characters.';
    return '';
  };

  const validateProduct = (val) => {
    if (!val) return 'Please select a product from the list.';
    return '';
  };

  const validateQty = (val) => {
    if (val === '' || val === null || val === undefined) return 'Quantity is required.';
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return 'Quantity must be at least 1 (cannot be 0 or negative).';
    return '';
  };

  const validateDisc = (val) => {
    if (val === '' || val === null || val === undefined) return 'Discount % is required (enter 0 if none).';
    const num = parseFloat(val);
    if (isNaN(num)) return 'Discount must be a valid number.';
    if (num < 0 || num > 100) return 'Discount % must be between 0 and 100.';
    return '';
  };

  // Calculations
  const calculateAmounts = (currentRate, currentQty, currentDisc) => {
    const r = parseFloat(currentRate) || 0;
    const d = parseFloat(currentDisc) || 0;
    const q = parseFloat(currentQty) || 0;

    if (r > 0) {
      const discountVal = (r * d) / 100;
      const net = r - discountVal;
      setNetAmount(net.toFixed(2));

      if (q > 0) {
        const total = net * q;
        setTotalAmount(total.toFixed(2));
      } else {
        setTotalAmount('0.00');
      }
    } else {
      setNetAmount('');
      setTotalAmount('');
    }
  };

  // Event handlers
  const handleCustomerNameChange = (e) => {
    if (gridItems.length > 0) return;
    const val = e.target.value;
    setCustomerName(val);
    if (touched.customerName) {
      setErrors((prev) => ({ ...prev, customerName: validateCustomerName(val) }));
    }
  };

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    setTouched((prev) => ({ ...prev, product: true }));
    setErrors((prev) => ({ ...prev, product: validateProduct(prodId) }));

    if (!prodId) {
      setRate('');
      setUnit('');
      setNetAmount('');
      setTotalAmount('');
      return;
    }

    const selected = productsList.find((p) => String(p.Product_ID) === String(prodId));
    if (selected) {
      const prodRate = Number(selected.Rate);
      setRate(prodRate);
      setUnit(selected.Unit);
      calculateAmounts(prodRate, qty, discPercent);
    }
  };

  const handleQtyChange = (e) => {
    let val = e.target.value;
    if (val.includes('-')) {
      val = val.replace(/-/g, '');
    }
    const num = parseFloat(val);
    if (!isNaN(num) && num < 0) {
      val = '';
    }
    setQty(val);
    if (touched.qty) {
      setErrors((prev) => ({ ...prev, qty: validateQty(val) }));
    }
    calculateAmounts(rate, val, discPercent);
  };

  const handleDiscChange = (e) => {
    let val = e.target.value;
    if (val.includes('-')) {
      val = val.replace(/-/g, '');
    }
    setDiscPercent(val);
    if (touched.discPercent) {
      setErrors((prev) => ({ ...prev, discPercent: validateDisc(val) }));
    }
    calculateAmounts(rate, qty, val);
  };

  // Handle + ADD item to Grid
  const handleAddItem = (e) => {
    e.preventDefault();

    // Mark all form fields as touched including Customer Name
    setTouched((prev) => ({
      ...prev,
      customerName: true,
      product: true,
      qty: true,
      discPercent: true
    }));

    const custErr = validateCustomerName(customerName);
    const prodErr = validateProduct(selectedProductId);
    const qtyErr = validateQty(qty);
    const discErr = validateDisc(discPercent);

    setErrors((prev) => ({
      ...prev,
      customerName: custErr,
      product: prodErr,
      qty: qtyErr,
      discPercent: discErr
    }));

    if (custErr || prodErr || qtyErr || discErr) {
      setToast({
        open: true,
        message: 'Please resolve validation errors before adding the item.',
        severity: 'warning'
      });
      return;
    }

    const selectedProd = productsList.find((p) => String(p.Product_ID) === String(selectedProductId));
    if (!selectedProd) return;

    const newItem = {
      id: Date.now(),
      Product_Id: selectedProd.Product_ID,
      Product_Name: selectedProd.Product_Name,
      Rate: parseFloat(rate),
      Unit: unit,
      Qty: parseFloat(qty),
      Disc_Percentage: parseFloat(discPercent),
      NetAmount: parseFloat(netAmount),
      TotalAmount: parseFloat(totalAmount)
    };

    setGridItems((prev) => [...prev, newItem]);
    setToast({
      open: true,
      message: `${selectedProd.Product_Name} added to grid.`,
      severity: 'info'
    });

    // Reset item form inputs
    setSelectedProductId('');
    setRate('');
    setUnit('');
    setQty('');
    setDiscPercent('0');
    setNetAmount('');
    setTotalAmount('');
    setTouched((prev) => ({
      ...prev,
      product: false,
      qty: false,
      discPercent: false
    }));
  };

  // Handle remove item from grid
  const handleRemoveItem = (id) => {
    setGridItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle in-grid quantity, discount, and product editing
  const handleGridValueChange = (id, field, value) => {
    setGridItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        let newProdId = item.Product_Id;
        let newProdName = item.Product_Name;
        let newRate = item.Rate;
        let newUnit = item.Unit;
        let newQty = item.Qty;
        let newDisc = item.Disc_Percentage;

        if (field === 'Product_Id') {
          const selected = productsList.find((p) => String(p.Product_ID) === String(value));
          if (selected) {
            newProdId = selected.Product_ID;
            newProdName = selected.Product_Name;
            newRate = Number(selected.Rate);
            newUnit = selected.Unit;
          }
        } else if (field === 'Qty') {
          // Allow empty string so user can delete and type new number
          if (value === '') {
            newQty = '';
          } else {
            newQty = String(value).replace(/-/g, '');
          }
        } else if (field === 'Disc_Percentage') {
          if (value === '') {
            newDisc = '';
          } else {
            let num = parseFloat(value);
            if (isNaN(num) || num < 0) num = 0;
            if (num > 100) num = 100;
            newDisc = num;
          }
        }

        const q = parseFloat(newQty);
        const validQty = !isNaN(q) && q > 0 ? q : 0;
        const d = parseFloat(newDisc);
        const validDisc = !isNaN(d) && d >= 0 ? d : 0;

        const net = newRate - (newRate * validDisc) / 100;
        const total = net * validQty;

        return {
          ...item,
          Product_Id: newProdId,
          Product_Name: newProdName,
          Rate: newRate,
          Unit: newUnit,
          Qty: newQty,
          Disc_Percentage: newDisc,
          NetAmount: parseFloat(net.toFixed(2)),
          TotalAmount: parseFloat(total.toFixed(2))
        };
      })
    );
  };

  // Calculate Grand Total
  const grandTotal = gridItems.reduce((acc, curr) => acc + (parseFloat(curr.TotalAmount) || 0), 0);

  // Submit entire invoice
  const handleSubmitInvoice = async () => {
    // Validate Customer Name
    setTouched((prev) => ({ ...prev, customerName: true }));
    const custErr = validateCustomerName(customerName);
    setErrors((prev) => ({ ...prev, customerName: custErr }));

    if (custErr) {
      setToast({
        open: true,
        message: 'Please enter a valid Customer Name.',
        severity: 'error'
      });
      return;
    }

    if (gridItems.length === 0) {
      setToast({
        open: true,
        message: 'Please add at least one product to the grid before submitting.',
        severity: 'warning'
      });
      return;
    }

    // Validate in-grid quantities: must not be empty, NaN, or <= 0
    const invalidQtyItem = gridItems.find(
      (item) => item.Qty === '' || isNaN(parseFloat(item.Qty)) || parseFloat(item.Qty) <= 0
    );

    if (invalidQtyItem) {
      setToast({
        open: true,
        message: `Please enter a valid quantity (minimum 1) for "${invalidQtyItem.Product_Name}". Quantity cannot be empty or zero.`,
        severity: 'error'
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        CustomerName: customerName.trim(),
        items: gridItems.map((item) => ({
          Product_Id: item.Product_Id,
          Rate: item.Rate,
          Unit: item.Unit,
          Qty: parseFloat(item.Qty),
          Disc_Percentage: parseFloat(item.Disc_Percentage) || 0,
          NetAmount: item.NetAmount,
          TotalAmount: item.TotalAmount
        }))
      };

      const res = await createInvoice(payload);
      if (res && res.success) {
        setToast({
          open: true,
          message: `Invoice #${res.data.Invoice_no} successfully generated for ${res.data.CustomerName}!`,
          severity: 'success'
        });

        // Reset state
        setCustomerName('');
        setGridItems([]);
        setTouched({
          customerName: false,
          product: false,
          qty: false,
          discPercent: false
        });

        if (onInvoiceSaved) {
          onInvoiceSaved(res.data);
        }
      }
    } catch (err) {
      console.error('Invoice submit error:', err);
      const msg = err.response?.data?.message || 'Failed to submit invoice to database.';
      setToast({ open: true, message: msg, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Form Design Card */}
      <Card elevation={2} sx={{ borderRadius: 3, mb: 4, overflow: 'visible' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Invoice Form
            </Typography>
            <Chip
              label="Real-time Calculation & Validation"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Form */}
          <form onSubmit={handleAddItem} noValidate>
            <Grid container spacing={2.5}>
              {/* Customer Name */}
              <Grid size={{ xs: 12 }}>
                <Tooltip
                  title={
                    gridItems.length > 0
                      ? 'Customer name cannot be changed until the invoice is submitted'
                      : ''
                  }
                  arrow
                  placement="top-start"
                  disableHoverListener={gridItems.length === 0}
                >
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Customer Name"
                      placeholder="e.g. Acme Corporation / Rajesh Patel"
                      value={customerName}
                      onChange={handleCustomerNameChange}
                      onBlur={() => {
                        if (gridItems.length > 0) return;
                        setTouched((prev) => ({ ...prev, customerName: true }));
                        setErrors((prev) => ({ ...prev, customerName: validateCustomerName(customerName) }));
                      }}
                      error={gridItems.length === 0 && touched.customerName && Boolean(errors.customerName)}
                      helperText={
                        gridItems.length > 0 ? (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#0284c7', mt: 0.5, fontWeight: 500 }}>
                            <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                            Customer name cannot be changed until the invoice is submitted
                          </Box>
                        ) : touched.customerName && errors.customerName ? (
                          errors.customerName
                        ) : (
                          'Enter full name of the customer'
                        )
                      }
                      slotProps={{
                        input: {
                          readOnly: gridItems.length > 0,
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon color={gridItems.length > 0 ? 'disabled' : 'action'} />
                            </InputAdornment>
                          ),
                          endAdornment: gridItems.length > 0 ? (
                            <InputAdornment position="end">
                              <Tooltip
                                title="Customer name cannot be changed until the invoice is submitted"
                                arrow
                                placement="top"
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    cursor: 'help',
                                    bgcolor: '#e0f2fe',
                                    color: '#0369a1',
                                    px: 1.2,
                                    py: 0.4,
                                    borderRadius: 1.5,
                                    border: '1px solid #bae6fd'
                                  }}
                                >
                                  <LockIcon sx={{ fontSize: 16 }} />
                                  <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                                </Box>
                              </Tooltip>
                            </InputAdornment>
                          ) : null
                        }
                      }}
                      sx={
                        gridItems.length > 0
                          ? {
                            backgroundColor: '#f8fafc',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f8fafc',
                              '& fieldset': {
                                borderColor: '#cbd5e1'
                              }
                            },
                            '& .MuiInputBase-input': {
                              cursor: 'not-allowed',
                              color: '#334155',
                              fontWeight: 600
                            }
                          }
                          : {}
                      }
                    />
                  </Box>
                </Tooltip>
              </Grid>

              {/* Product Select */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Product"
                  value={selectedProductId}
                  onChange={handleProductChange}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, product: true }));
                    setErrors((prev) => ({ ...prev, product: validateProduct(selectedProductId) }));
                  }}
                  error={touched.product && Boolean(errors.product)}
                  helperText={touched.product && errors.product ? errors.product : 'Select item from database inventory'}
                  disabled={loadingProducts}
                >
                  <MenuItem value="">
                    <em>-- Select Product --</em>
                  </MenuItem>
                  {productsList.map((prod) => (
                    <MenuItem key={prod.Product_ID} value={prod.Product_ID}>
                      {prod.Product_Name} (₹{Number(prod.Rate).toFixed(2)} / {prod.Unit})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Rate (Auto-fetch Read-only) */}
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Rate (Auto-fetch)"
                  value={rate !== '' ? Number(rate).toFixed(2) : ''}
                  placeholder="—"
                  slotProps={{
                    input: {
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }
                  }}
                  helperText="Fetched from Product Master"
                  sx={{ backgroundColor: '#f8fafc', borderRadius: 1 }}
                />
              </Grid>

              {/* Unit (Auto-fetch Read-only) */}
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Unit (Auto-fetch)"
                  value={unit || ''}
                  placeholder="—"
                  slotProps={{
                    input: { readOnly: true }
                  }}
                  helperText="Measurement unit"
                  sx={{ backgroundColor: '#f8fafc', borderRadius: 1 }}
                />
              </Grid>

              {/* Qty */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  placeholder="1"
                  value={qty}
                  onChange={handleQtyChange}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, qty: true }));
                    setErrors((prev) => ({ ...prev, qty: validateQty(qty) }));
                  }}
                  error={touched.qty && Boolean(errors.qty)}
                  helperText={touched.qty && errors.qty ? errors.qty : 'Minimum 1 (positive only)'}
                  slotProps={{
                    htmlInput: { min: 1, step: 'any' },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              {/* Discount (%) */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Discount (%)"
                  placeholder="0"
                  value={discPercent}
                  onChange={handleDiscChange}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, discPercent: true }));
                    setErrors((prev) => ({ ...prev, discPercent: validateDisc(discPercent) }));
                  }}
                  error={touched.discPercent && Boolean(errors.discPercent)}
                  helperText={touched.discPercent && errors.discPercent ? errors.discPercent : 'Range: 0% to 100%'}
                  slotProps={{
                    htmlInput: { min: 0, max: 100, step: 'any' },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <PercentIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              {/* Net Amount (Auto-calculated) */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Net Amount"
                  value={netAmount !== '' ? `₹${netAmount}` : '—'}
                  slotProps={{
                    input: { readOnly: true }
                  }}
                  helperText="Rate - (Disc% of Rate)"
                  sx={{ backgroundColor: '#f8fafc', borderRadius: 1 }}
                />
              </Grid>

              {/* Total Amount (Auto-calculated) */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Total Amount"
                  value={totalAmount !== '' ? `₹${totalAmount}` : '—'}
                  slotProps={{
                    input: {
                      readOnly: true,
                      style: { fontWeight: 'bold', color: '#1e293b' }
                    }
                  }}
                  helperText="Net Amount × Qty"
                  sx={{ backgroundColor: '#f8fafc', borderRadius: 1 }}
                />
              </Grid>

              {/* + ADD Button */}
              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{
                    px: 4,
                    py: 1.2,
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 2
                  }}
                >
                  ADD PRODUCT
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Grid Section */}
      <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Products in Invoice Grid ({gridItems.length})
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              * Note: Items in grid are stored in-memory until final SUBMIT
            </Typography>
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="medium">
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, minWidth: '200px' }}>Product </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Rate (₹)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Unit</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, width: '130px' }}>Qty </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, width: '130px' }}>Disc% </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Net Amt (₹)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Total Amt (₹)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gridItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No products added to invoice grid yet. Choose a product above and click <strong>"+ ADD"</strong>.
                    </TableCell>
                  </TableRow>
                ) : (
                  gridItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ minWidth: '200px' }}>
                        <TextField
                          select
                          size="small"
                          fullWidth
                          value={item.Product_Id}
                          onChange={(e) => handleGridValueChange(item.id, 'Product_Id', e.target.value)}
                          sx={{
                            '& .MuiSelect-select': {
                              fontWeight: 600,
                              py: 0.8
                            }
                          }}
                        >
                          {productsList.map((prod) => (
                            <MenuItem key={prod.Product_ID} value={prod.Product_ID}>
                              {prod.Product_Name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {Number(item.Rate).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={item.Unit} size="small" variant="outlined" color="primary" />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={item.Qty}
                          placeholder="Qty"
                          onChange={(e) => handleGridValueChange(item.id, 'Qty', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                          error={item.Qty === '' || isNaN(parseFloat(item.Qty)) || parseFloat(item.Qty) <= 0}
                          helperText={
                            item.Qty === '' || isNaN(parseFloat(item.Qty)) || parseFloat(item.Qty) <= 0
                              ? 'Required'
                              : ''
                          }
                          slotProps={{
                            htmlInput: { min: 1, step: 'any', style: { textAlign: 'center', width: '60px' } },
                            formHelperText: { sx: { textAlign: 'center', mx: 0, fontSize: '0.7rem' } }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={item.Disc_Percentage}
                          onChange={(e) => handleGridValueChange(item.id, 'Disc_Percentage', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                          slotProps={{
                            htmlInput: { min: 0, max: 100, style: { textAlign: 'center', width: '60px' } }
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">{item.NetAmount.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ₹{item.TotalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Remove item">
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteOutlineIcon fontSize="small" />}
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{ fontWeight: 700, textTransform: 'none' }}
                          >
                            REMOVE
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Grand Total Bar */}
          {gridItems.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 3,
                p: 2.5,
                backgroundColor: '#eff6ff',
                borderRadius: 2,
                border: '1px solid #bfdbfe'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                Total Line Items: {gridItems.length}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Grand Total Amount:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ₹{grandTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Final Submit Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 0,
              pt: 2,
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="large"
              disabled={submitting || gridItems.length === 0}
              onClick={handleSubmitInvoice}
              startIcon={<CheckCircleOutlineIcon />}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 2.5,
                textTransform: 'none',
                boxShadow: 3
              }}
            >
              {submitting ? 'SAVING INVOICE...' : 'SUBMIT INVOICE'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%', fontWeight: 600 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceFormMui;
