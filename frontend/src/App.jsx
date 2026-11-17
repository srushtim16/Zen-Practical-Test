import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  AddCircle as AddCircleOutlineIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

import InvoiceFormMui from './components/InvoiceFormMui';
import SavedInvoicesScreen from './components/SavedInvoicesScreen';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern vibrant blue
      dark: '#1d4ed8'
    },
    secondary: {
      main: '#475569'
    },
    background: {
      default: '#f1f5f9'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 8
  }
});

// Navigation Bar Component
const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isFormActive = location.pathname === '/';
  const isHistoryActive = location.pathname === '/saved-invoices';

  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer'
            }}
          >
            <ReceiptIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1.2 }}>
                Zen Practical Test
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>


            <Button
              variant={isHistoryActive ? 'contained' : 'outlined'}
              color="primary"
              startIcon={<HistoryIcon />}
              onClick={() => navigate('/saved-invoices')}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                px: 2
              }}
            >
              Saved Invoices Screen
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

// Main Form Page
const InvoiceFormPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <InvoiceFormMui />
    </Container>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<InvoiceFormPage />} />
          <Route path="/saved-invoices" element={<SavedInvoicesScreen />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
