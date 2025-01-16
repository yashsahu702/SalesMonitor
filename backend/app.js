const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const seedRoute = require('./routes/api/seed');
const allSalesRoute = require('./routes/api/allSales');
const salesStatsRoute = require('./routes/api/salesStats');
const barChartRoute = require('./routes/api/barChart');
const piChartRoute = require('./routes/api/piChart');
const combineRoute = require('./routes/api/combine');

require('dotenv').config();
const app = express();
app.use(cors());
const dbUri = process.env.DB_URI;
app.use(express.json());

app.use('/api', seedRoute);
app.use('/api', allSalesRoute);
app.use('/api', salesStatsRoute);
app.use('/api', barChartRoute);
app.use('/api', piChartRoute);
app.use('/api', combineRoute);

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
  app.listen(5000, () => console.log('Server is running on port 5000'));
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});
