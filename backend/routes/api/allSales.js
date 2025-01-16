const express = require('express');
const Sale = require('../../models/salesModel');
const router = express.Router();

// Helper function to get the month number from the month name
const getMonthNumber = (monthName) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName) + 1;
};

// List transactions with search and pagination
router.get('/allSales', async (req, res) => {
  const { month, search = '', page = 1, perPage = 10 } = req.query;

  // Validate month input
  if (!month || !getMonthNumber(month)) {
    return res.status(400).send('Invalid month parameter');
  }

  // Validate page and perPage (ensure they're positive integers)
  const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const perPageNum = parseInt(perPage, 10) > 0 ? parseInt(perPage, 10) : 10;

  try {
    // Get the month number from the provided month name
    const monthNumber = getMonthNumber(month);

    // Build the aggregation pipeline for filtering by month
    const pipeline = [
      // Match documents where the month of dateOfSale matches the selected month
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          dateOfSale: 1,
          sold: 1,
          month: { $month: '$dateOfSale' }, // Extract month from dateOfSale
        },
      },
      {
        $match: {
          month: monthNumber, // Match the month part (ignoring year)
        },
      },
      {
        $skip: (pageNum - 1) * perPageNum, // Pagination: Skip documents for current page
      },
      {
        $limit: perPageNum, // Limit results based on perPage
      },
    ];

    // If there's a search term, add it to the aggregation pipeline
    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive search
      pipeline.push({
        $match: {
          $or: [
            { title: regex },
            { description: regex },
            { price: { $regex: regex.toString() } }, // Price search
          ],
        },
      });
    }

    // Perform aggregation
    const sales = await Sale.aggregate(pipeline);

    // Fetch total count of matching products (for pagination)
    const totalCount = await Sale.aggregate([
      { $project: { month: { $month: '$dateOfSale' } } },
      { $match: { month: monthNumber } },
      { $count: 'totalCount' },
    ]);

    const total = totalCount[0]?.totalCount || 0;

    // Return the result in a structured response
    res.status(200).json({
      totalCount: total,
      sales,
      currentPage: pageNum,
      totalPages: Math.ceil(total / perPageNum),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

module.exports = router;
