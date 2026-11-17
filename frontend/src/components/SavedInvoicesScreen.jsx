import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ReceiptLong as ReceiptLongIcon,
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Inventory2 as Inventory2Icon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';

import { getInvoices } from '../services/api';

const SavedInvoicesScreen = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getInvoices();
      if (res && res.data) {
        setInvoices(res.data);
        if (res.data.length > 0) {
          setExpandedAccordion(res.data[0].Invoice_Id);
        }
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccordionChange = (invoiceId) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? invoiceId : false);
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    const cust = (inv.CustomerName || '').toLowerCase();
    const invNo = String(inv.Invoice_no);
    return cust.includes(term) || invNo.includes(term);
  });

  // Calculate statistics
  const totalInvoicesCount = invoices.length;
  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + (parseFloat(inv.TotalAmount) || 0),
    0
  );
  const avgInvoiceValue = totalInvoicesCount > 0 ? totalRevenue / totalInvoicesCount : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Top Navigation & Action Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5
            }}
          >
            Back to Form
          </Button>
          <Box>
            <Typography variant="h5" fontWeight={800} color="text.primary">
              Saved Invoices History
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Refresh from database">
            <IconButton onClick={fetchInvoices} color="primary" sx={{ border: '1px solid #cbd5e1' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={() => navigate('/')}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              px: 3
            }}
          >
            Create New Invoice
          </Button>
        </Box>
      </Box>

      {/* Overview Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={1} sx={{ borderRadius: 2.5, backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    TOTAL INVOICES GENERATED
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="primary.main" mt={0.5}>
                    {totalInvoicesCount}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    backgroundColor: '#eff6ff',
                    color: '#2563eb'
                  }}
                >
                  <ReceiptLongIcon sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={1} sx={{ borderRadius: 2.5, backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    TOTAL REVENUE BILLED
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="#15803d" mt={0.5}>
                    ₹
                    {totalRevenue.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    backgroundColor: '#f0fdf4',
                    color: '#15803d'
                  }}
                >
                  <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={1} sx={{ borderRadius: 2.5, backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    AVERAGE INVOICE VALUE
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="#475569" mt={0.5}>
                    ₹
                    {avgInvoiceValue.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    color: '#64748b'
                  }}
                >
                  <Inventory2Icon sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2.5, mb: 3.5, backgroundColor: '#ffffff' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <TextField
            size="small"
            placeholder="Search by customer name or invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 400 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }
            }}
          />

          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Showing {filteredInvoices.length} of {totalInvoicesCount} invoices
          </Typography>
        </Box>
      </Paper>

      {/* Main Invoices List */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={50} />
          <Typography variant="body1" color="text.secondary" mt={2} fontWeight={600}>
            Loading invoice records from MySQL database...
          </Typography>
        </Box>
      ) : filteredInvoices.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            borderRadius: 3,
            backgroundColor: '#ffffff'
          }}
        >
          <Inventory2Icon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color="text.primary">
            {searchTerm ? 'No matching invoices found' : 'No invoices in database yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1} mb={3}>
            {searchTerm
              ? `No invoices matched "${searchTerm}". Try a different keyword.`
              : 'Submit an invoice from the form to view records here.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={() => navigate('/')}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, marginTop: 2 }}
          >
            Create Your First Invoice
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {filteredInvoices.map((inv) => {
            const isExpanded = expandedAccordion === inv.Invoice_Id;

            return (
              <Box key={inv.Invoice_Id} sx={{ mb: 2.5 }}>
                <Accordion
                  expanded={isExpanded}
                  onChange={handleAccordionChange(inv.Invoice_Id)}
                  elevation={isExpanded ? 3 : 1}
                  sx={{
                    borderRadius: '12px !important',
                    overflow: 'hidden',
                    border: isExpanded ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    '&:before': { display: 'none' },
                    '& .MuiAccordionSummary-root': {
                      minHeight: 64,
                      px: { xs: 2, md: 3 }
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0 !important',
                      width: '100%'
                    }
                  }}
                >
                  {/* Single Row Horizontal Header */}
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon color={isExpanded ? 'primary' : 'action'} />}
                    sx={{
                      backgroundColor: isExpanded ? '#f0f7ff' : '#ffffff',
                      '&:hover': { backgroundColor: '#f8fafc' }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        pr: 2,
                        gap: 2
                      }}
                    >
                      {/* Left: INV Badge + PersonIcon with Customer Name in ONE ROW */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Chip
                          label={`INV #${inv.Invoice_no}`}
                          color={isExpanded ? 'primary' : 'default'}
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            px: 0.5
                          }}
                        />

                        {/* PersonIcon + Name in ONE ROW */}
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8 }}>
                          <PersonIcon color="primary" sx={{ fontSize: 20 }} />
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="#1e293b"
                            noWrap
                          >
                            {inv.CustomerName}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Middle: Date + Items count */}
                      <Box
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                          <CalendarTodayIcon sx={{ fontSize: 15, color: '#64748b' }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {inv.Invoice_Date}
                          </Typography>
                        </Box>

                        <Chip
                          label={`${inv.details?.length || 0} item(s)`}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: '0.78rem' }}
                        />
                      </Box>

                      {/* Right: Total Amount */}
                      <Box sx={{ textAlign: 'right', minWidth: 130 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 800,
                            color: '#15803d',
                            lineHeight: 1.2
                          }}
                        >
                          ₹
                          {parseFloat(inv.TotalAmount).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: { xs: 'block', sm: 'none' } }}
                        >
                          {inv.Invoice_Date}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <Divider />

                  {/* Expanded Breakdown Table */}
                  <AccordionDetails sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f8fafc' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.8,
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="text.primary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}
                      >
                        <ReceiptLongIcon fontSize="small" color="primary" />
                        Line Items Breakdown
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Invoice ID (PK): <strong>#{inv.Invoice_Id}</strong> | Invoice No:{' '}
                        <strong>#{inv.Invoice_no}</strong>
                      </Typography>
                    </Box>

                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden'
                      }}
                    >
                      <Table size="small">
                        <TableHead sx={{ backgroundColor: '#edf2f7' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, py: 1.2 }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                              Rate (₹)
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                              Unit
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                              Qty
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                              Disc %
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                              Net Amt (₹)
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                              Total Amt (₹)
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {inv.details?.map((d, index) => (
                            <TableRow key={d.InvoiceDetail_Id || index} hover>
                              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                {index + 1}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {d.product?.Product_Name || `Product #${d.Product_Id}`}
                              </TableCell>
                              <TableCell align="right">
                                {parseFloat(d.Rate).toFixed(2)}
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={d.Unit}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem', height: 22 }}
                                />
                              </TableCell>
                              <TableCell align="center" sx={{ fontWeight: 600 }}>
                                {parseFloat(d.Qty).toFixed(2)}
                              </TableCell>
                              <TableCell align="center">
                                {parseFloat(d.Disc_Percentage) > 0 ? (
                                  <Chip
                                    label={`${parseFloat(d.Disc_Percentage).toFixed(2)}%`}
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                    sx={{ fontSize: '0.75rem', height: 22, fontWeight: 600 }}
                                  />
                                ) : (
                                  '0%'
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {parseFloat(d.NetAmount).toFixed(2)}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{ fontWeight: 700, color: '#2563eb' }}
                              >
                                ₹{parseFloat(d.TotalAmount).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Total Bar */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        mt: 1.8,
                        gap: 1.5
                      }}
                    >
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        Invoice Grand Total:
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="#15803d">
                        ₹
                        {parseFloat(inv.TotalAmount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default SavedInvoicesScreen;

