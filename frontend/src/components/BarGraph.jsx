import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = ({ month }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Items',
        data: [],
        backgroundColor: '#4e73df',
        borderColor: '#4e73df',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  // Fetch the bar chart data from the API
  const fetchBarChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/barChart', {
        params: {
          month,
        },
      });

      // Ensure you're correctly accessing the data array from the response
      const data = response.data.data; // Accessing the `data` array here

      console.log("API Response Data:", data); // Add debugging line to see the raw data

      const formattedData = formatBarChartData(data);
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  // Format the fetched data to match the chart structure
  const formatBarChartData = (data) => {
    const priceRanges = [
      '0 - 100',
      '101 - 200',
      '201 - 300',
      '301 - 400',
      '401 - 500',
      '501 - 600',
      '601 - 700',
      '701 - 800',
      '801 - 900',
      '901 - above',
    ];

    const itemCounts = new Array(10).fill(0); // Initialize item counts for each price range

    // Map the response data to the correct price range
    data.forEach((item) => {
      const range = item.range;
      let count = item.count;

      // Ensure that count is an integer (removes decimals)
      count = Math.floor(count); // Use Math.floor() to round down to an integer

      const index = priceRanges.indexOf(range);
      if (index !== -1) {
        itemCounts[index] = count;  // Store the integer count
      }
    });

    console.log("Formatted Chart Data:", itemCounts); // Debugging line to inspect the formatted data

    return {
      labels: priceRanges,  // Use the price ranges as labels on the X-axis
      datasets: [
        {
          label: 'Number of Items',
          data: itemCounts,  // Use the formatted item counts
          backgroundColor: '#4e73df',  // Color for bars
          borderColor: '#4e73df',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f7f8fc', borderRadius: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
        Items in Price Range - {month}
      </Typography>

      {/* Centering the Bar chart */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '500px', // Optional: Set a height for the container to ensure proper layout
        }}
      >
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Number of Items in Price Ranges for ${month}`,
                font: {
                  size: 18,
                },
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `${tooltipItem.raw.toFixed(0)} items`, // Ensure count is displayed as an integer
                },
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Price Range',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Items',
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default BarGraph;
