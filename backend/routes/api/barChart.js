const express = require('express');
const Sale = require('../../models/salesModel');
const router = express.Router();

// Helper function to get the month number from the month name
const getMonthNumber = (monthName) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName) + 1;
};

// Bar Chart API for price ranges
router.get('/barChart', async (req, res) => {
  const { month } = req.query;

  // Validate month input
  if (!month || !getMonthNumber(month)) {
    return res.status(400).send('Invalid month parameter');
  }

  try {
    const monthNumber = getMonthNumber(month);

    // Define the predefined price ranges
    const priceRanges = [
      { range: '0 - 100', min: 0, max: 100 },
      { range: '101 - 200', min: 101, max: 200 },
      { range: '201 - 300', min: 201, max: 300 },
      { range: '301 - 400', min: 301, max: 400 },
      { range: '401 - 500', min: 401, max: 500 },
      { range: '501 - 600', min: 501, max: 600 },
      { range: '601 - 700', min: 601, max: 700 },
      { range: '701 - 800', min: 701, max: 800 },
      { range: '801 - 900', min: 801, max: 900 },
      { range: '901 - above', min: 901, max: Infinity },
    ];

    // Aggregation pipeline to categorize products based on price
    const pipeline = [
      {
        $project: {
          price: 1,
          month: { $month: '$dateOfSale' }, // Extract month from dateOfSale
        },
      },
      {
        $match: {
          month: monthNumber, // Match the month part (ignoring year)
        },
      },
      {
        $addFields: {
          priceRange: {
            $switch: {
              branches: priceRanges.map((range) => ({
                case: { $and: [{ $gte: ['$price', range.min] }, { $lt: ['$price', range.max] }] },
                then: range.range,
              })),
              default: 'Other',
            },
          },
        },
      },
      {
        $group: {
          _id: '$priceRange', // Group by the calculated priceRange
          count: { $sum: 1 }, // Count the number of items in each group
        },
      },
      {
        $sort: { _id: 1 }, // Sort the result by the range
      },
    ];

    // Perform the aggregation
    const result = await Sale.aggregate(pipeline);

    // Format the result into the structure we want to return
    const formattedResult = priceRanges.map(range => {
      const matchingResult = result.find(r => r._id === range.range);
      return {
        range: range.range,
        count: matchingResult ? matchingResult.count : 0, // If no matching result, set count to 0
      };
    });

    // Return the result as a structured JSON response
    res.status(200).json({
      data: formattedResult,
    });
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).send('Error fetching bar chart data');
  }
});

module.exports = router;
