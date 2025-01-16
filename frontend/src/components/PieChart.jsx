import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Register necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ month }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#8C33FF', '#33FFF7', '#FF338E', '#F7FF33', '#33FF91',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    fetchPieChartData();
  }, [month]);

  // Fetch data for Pie Chart from API
  const fetchPieChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pieChart', {
        params: { month },
      });

      // The actual data is inside the 'data' field of the response
      const formattedData = formatPieChartData(response.data.data); // Use response.data.data
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  // Format the fetched data for Pie Chart
  const formatPieChartData = (data) => {
    const categories = [];
    const itemCounts = [];

    data.forEach((item) => {
      categories.push(item.range);  // Add the price range (category)
      itemCounts.push(item.count);  // Add the number of items in that range
    });

    return {
      labels: categories,
      datasets: [
        {
          data: itemCounts,
          backgroundColor: [
            '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#8C33FF', '#33FFF7', '#FF338E', '#F7FF33', '#33FF91',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f7f8fc', borderRadius: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
        Transactions by Category - {month}
      </Typography>

      {/* Center the Pie chart */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px', // Optional: Set a height for the container
        }}
      >
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Items Count by Category for ${month}`,
                font: {
                  size: 18,
                },
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `${tooltipItem.raw} items`, // Show item count in tooltips
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PieChart;
