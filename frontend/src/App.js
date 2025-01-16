import React, { useState } from 'react';
import SalesTable from './components/SalesTable';
import SalesStats from './components/SalesStats';
import BarGraph from './components/BarGraph';
import PieChart from './components/PieChart';
import CombinedApiTest from './components/CombinedApiTest';
import { Container, Grid, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const App = () => {
  const [month, setMonth] = useState('March');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleSeed = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/seed');
      if (response.status === 200) {
        setSnackbar({ open: true, message: 'Seeded successfully', severity: 'success' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Problem in seeding', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <SalesStats month={month} />
        </Grid>
        <Grid item xs={12}>
          <SalesTable appMonth={setMonth} />
        </Grid>
        <Grid item xs={12}>
          <BarGraph month={month} />
        </Grid>
        <Grid item xs={12}>
          <PieChart month={month} />
        </Grid>
        <Grid item xs={12}>
          <CombinedApiTest month={month} />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleSeed}>
            Seed Data
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
