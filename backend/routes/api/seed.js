const express = require('express');
const axios = require('axios');
const Sale = require('../../models/salesModel');
const router = express.Router();
require('dotenv').config()
// URL of the external API
const apiUrl = process.env.DATA_API;

router.get('/seed', async (req, res) => {
  try {
    console.log("tryinggggg")
    const response = await axios.get(apiUrl);
    const data = response.data;
    console.log(data)
    await Sale.deleteMany({});
    
    await Sale.insertMany(data);

    res.status(200).send('Database seeded successfully!');
  } catch (error) {
    res.status(500).send('Error seeding the database: ' + error.message);
  }
});

module.exports = router;
