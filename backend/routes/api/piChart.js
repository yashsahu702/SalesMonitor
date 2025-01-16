const express = require('express');
const Sale = require('../../models/salesModel');
const router = express.Router();

// Helper function to get the month number from the month name
const getMonthNumber = (monthName) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName) + 1;
};

// Pie Chart API for categories
router.get('/pieChart', async (req, res) => {
  const { month } = req.query;

  // Validate month input
  if (!month || !getMonthNumber(month)) {
    return res.status(400).send('Invalid month parameter');
  }

  try {
    const monthNumber = getMonthNumber(month);

    // Aggregation pipeline to group items by category and count their occurrences
    const pipeline = [
      {
        $project: {
          category: 1,
          month: { $month: '$dateOfSale' }, // Extract month from dateOfSale
        },
      },
      {
        $match: {
          month: monthNumber, // Match the month part (ignoring year)
        },
      },
      {
        $group: {
          _id: '$category', // Group by category
          count: { $sum: 1 }, // Count the number of items in each category
        },
      },
      {
        $sort: { count: -1 }, // Sort the categories by item count in descending order
      },
    ];

    // Perform the aggregation
    const result = await Sale.aggregate(pipeline);

    // Format the result into the structure we want to return
    const formattedResult = result.map(item => ({
      category: item._id,
      count: item.count,
    }));

    // Return the result as a structured JSON response
    res.status(200).json({
      data: formattedResult,
    });
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).send('Error fetching pie chart data');
  }
});

module.exports = router;
