const express = require('express');
const Sale = require('../../models/salesModel');
const router = express.Router();

// Helper function to get the month number from the month name
const getMonthNumber = (monthName) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName) + 1;
};

// Statistics route to get total sale amount, sold items, and not sold items
router.get('/statistics', async (req, res) => {
  const { month } = req.query;

  // Validate month input
  if (!month || !getMonthNumber(month)) {
    return res.status(400).send('Invalid month parameter');
  }

  try {
    const monthNumber = getMonthNumber(month);

    // Define the aggregation pipeline to get the statistics for the selected month
    const pipeline = [
      // Match documents where the month of dateOfSale matches the selected month
      {
        $project: {
          title: 1,
          price: 1,
          sold: 1,
          month: { $month: '$dateOfSale' }, // Extract month from dateOfSale
        },
      },
      {
        $match: {
          month: monthNumber, // Match the month part (ignoring year)
        },
      },
    ];

    // Total sale amount (sum of the price of all sold items)
    const totalSaleAmountResult = await Sale.aggregate([
      ...pipeline,
      {
        $match: { sold: true }, // Filter only sold items
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: '$price' }, // Sum of the price for sold items
        },
      },
    ]);

    // Total sold items
    const totalSoldItemsResult = await Sale.aggregate([
      ...pipeline,
      {
        $match: { sold: true }, // Filter only sold items
      },
      {
        $count: 'totalSoldItems',
      },
    ]);

    // Total not sold items
    const totalNotSoldItemsResult = await Sale.aggregate([
      ...pipeline,
      {
        $match: { sold: false }, // Filter only not sold items
      },
      {
        $count: 'totalNotSoldItems',
      },
    ]);

    // Get the total sale amount (default to 0 if no result)
    const totalSaleAmount = totalSaleAmountResult[0]?.totalSaleAmount || 0;
    const totalSoldItems = totalSoldItemsResult[0]?.totalSoldItems || 0;
    const totalNotSoldItems = totalNotSoldItemsResult[0]?.totalNotSoldItems || 0;

    // Return the statistics in a structured response
    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send('Error fetching statistics');
  }
});

module.exports = router;
