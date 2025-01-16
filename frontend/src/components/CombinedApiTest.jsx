import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const CombinedApiTest = ({month}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch combined data from the backend API
  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const response = await axios.get('http://localhost:5000/api/combinedData', {
          params: { month }
        });
        // Check if the API response contains the expected data
        if (response.data && response.data.sales && response.data.statistics && response.data.pieChart) {
          setSuccess(true); // Mark as successful if data is valid
        } else {
          setSuccess(false); // Mark as failure if response data is incomplete
        }
      } catch (error) {
        console.error('Error fetching combined data:', error);
        setError('Failed to fetch combined data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedData();
  }, [month]);

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f7f8fc', borderRadius: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
        Testing Combined API for {month}
      </Typography>

      {/* Show loading spinner */}
      {loading && <CircularProgress />}

      {/* Show error message */}
      {error && !loading && (
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      )}

      {/* Show success message if API is working */}
      {!loading && !error && success && (
        <Typography variant="h6" color="success.main">
          The Combined API is working correctly!
        </Typography>
      )}

      {/* Show failure message if API call was not successful */}
      {!loading && !error && !success && (
        <Typography variant="h6" color="error">
          The Combined API is not working correctly. Please check the backend.
        </Typography>
      )}
    </Box>
  );
};

export default CombinedApiTest;
