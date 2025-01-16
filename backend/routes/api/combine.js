const express = require('express');
const Sale = require('../../models/salesModel');
const router = express.Router();
const axios = require('axios');  // Using axios to call other APIs (sales, statistics, pie chart)

// Helper function to get the month number from the month name
const getMonthNumber = (monthName) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName) + 1;
};

// Combined API to get sales data, statistics, and pie chart
router.get('/combinedData', async (req, res) => {
  const { month, page = 1, perPage = 10, search = '' } = req.query;

  // Validate month input
  if (!month || !getMonthNumber(month)) {
    return res.status(400).send('Invalid month parameter');
  }

  try {
    const monthNumber = getMonthNumber(month);

    // Fetch sales data
    const salesResponse = await axios.get('http://localhost:5000/api/allSales', {
      params: {
        month,
        page,
        perPage,
        search,
      },
    });

    // Fetch statistics data
    const statisticsResponse = await axios.get('http://localhost:5000/api/statistics', {
      params: {
        month,
      },
    });

    // Fetch pie chart data
    const pieChartResponse = await axios.get('http://localhost:5000/api/pieChart', {
      params: {
        month,
      },
    });

    // Combine all responses
    const combinedData = {
      sales: salesResponse.data,
      statistics: statisticsResponse.data,
      pieChart: pieChartResponse.data,
    };

    // Send the combined response
    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).send('Error fetching combined data');
  }
});

module.exports = router;
