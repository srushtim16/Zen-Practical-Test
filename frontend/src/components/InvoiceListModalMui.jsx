import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ReceiptLong as ReceiptLongIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Inventory2 as Inventory2Icon
} from '@mui/icons-material';
import { getInvoices } from '../services/api';

const InvoiceListModalMui = ({ open, onClose, refreshTrigger }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  useEffect(() => {
    if (open) {
      fetchInvoices();
    }
  }, [open, refreshTrigger]);

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

  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    const cust = (inv.CustomerName || '').toLowerCase();
    const invNo = String(inv.Invoice_no);
    return cust.includes(term) || invNo.includes(term);
  });

  const totalInvoicesCount = invoices.length;
  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + (parseFloat(inv.TotalAmount) || 0),
    0
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          px: { xs: 2.5, md: 4 },
          py: 2.2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box display="flex" alignItems="center" gap={1.8}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Saved Invoices Database
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Search and Summary */}
      <Box
        sx={{
          backgroundColor: '#f8fafc',
          px: { xs: 2.5, md: 4 },
          py: 2,
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <TextField
          size="small"
          placeholder="Search by customer name or invoice..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 340 },
            backgroundColor: '#ffffff',
            borderRadius: 1.5
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              )
            }
          }}
        />

        <Box display="flex" gap={1.5} alignItems="center">
          <Chip
            icon={<ReceiptLongIcon fontSize="small" />}
            label={`Total Invoices: ${totalInvoicesCount}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, backgroundColor: '#ffffff' }}
          />
        </Box>
      </Box>

      {/* Dialog Body with clear spacing between invoice cards */}
      <DialogContent sx={{ p: { xs: 2, md: 3.5 }, backgroundColor: '#f1f5f9' }}>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <CircularProgress size={45} />
            <Typography variant="body2" color="text.secondary" mt={2} fontWeight={500}>
              Loading invoice records from MySQL...
            </Typography>
          </Box>
        ) : filteredInvoices.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 8,
              px: 3,
              borderRadius: 3,
              border: '2px dashed #cbd5e1',
              backgroundColor: '#ffffff'
            }}
          >
            <Inventory2Icon sx={{ fontSize: 50, color: '#94a3b8', mb: 1.5 }} />
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {searchTerm ? 'No matching invoices found' : 'No invoices in database yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {searchTerm
                ? `No results found for "${searchTerm}". Try searching by another keyword.`
                : 'Create and submit your first invoice from the main form!'}
            </Typography>
          </Paper>
        ) : (
          <Box display="flex" flexDirection="column">
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
                    {/* Strictly One Row Horizontal Header */}
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
                        {/* Left Section: Badge + Customer Name */}
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

                          {/* PersonIcon + Customer Name strictly */}
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

                        {/* Middle Section: Date + Items count */}
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

                        {/* Right Section: Total Amount */}
                        <Box sx={{ textAlign: 'right', minWidth: 120 }}>
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
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1.8}
                        flexWrap="wrap"
                        gap={1}
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
                          Invoice ID: <strong>#{inv.Invoice_Id}</strong> | Invoice No:{' '}
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
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          flexWrap: 'nowrap',
                          gap: 1.5,
                          mt: 1.8,
                          width: '100%',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.secondary"
                          sx={{ flexShrink: 0 }}
                        >
                          Invoice Grand Total:
                        </Typography>

                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          color="#15803d"
                          sx={{ flexShrink: 0 }}
                        >
                          ₹{parseFloat(inv.TotalAmount).toLocaleString('en-IN', {
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
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: { xs: 2.5, md: 4 },
          py: 2,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Showing {filteredInvoices.length} of {totalInvoicesCount} record(s)
        </Typography>

        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceListModalMui;
