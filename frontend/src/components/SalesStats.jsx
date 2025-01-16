import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';

const SalesStats = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/statistics', {
        params: { month },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const formatPrice = (price) => {
    return price.toFixed(2); // Ensure only two decimal places
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f7f8fc", borderRadius: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: "#2c3e50", fontWeight: "bold" }}>
        Monthly Sales Statistics - {month}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 2, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#ecf0f1" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#2980b9", fontWeight: "bold" }}>
                Total Sale Amount 
              </Typography>
              <Typography variant="h5" sx={{ color: "#27ae60", fontWeight: "bold" }}>
                ${formatPrice(statistics.totalSaleAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 2, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#ecf0f1" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#2980b9", fontWeight: "bold" }}>
                Total Sold Items
              </Typography>
              <Typography variant="h5" sx={{ color: "#e67e22", fontWeight: "bold" }}>
                {statistics.totalSoldItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 2, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#ecf0f1" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#2980b9", fontWeight: "bold" }}>
                Total Not Sold Items
              </Typography>
              <Typography variant="h5" sx={{ color: "#c0392b", fontWeight: "bold" }}>
                {statistics.totalNotSoldItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesStats;
