# frontend

The frontend of this application is built using React.js and Material-UI. To start the frontend:

Navigate to the frontend folder:

### `cd frontend`

Install dependencies:

### `npm install`

Start the development server:

### `npm start`

Open your browser and visit http://localhost:3000 to view the application.

# Backend

The backend of this application is built using Node.js and Express.js. It provides APIs to fetch data for the application. To start the backend:

Navigate to the backend folder:

### `cd backend`

Install dependencies:

### `npm install`

Start the server:

### `node app.js`

The backend will be running on http://localhost:5000.

### APIs Overview

The backend exposes the following APIs:

## Seed Data API

Endpoint: `GET /api/seed`

Description: Initializes the database by fetching JSON from a third-party API and seeding it into the database.

## All Transactions API

Endpoint: `GET /api/allSales`

Description: Lists all transactions with support for search and pagination.

## Statistics API

Endpoint: `GET /api/statistics`

Description: Provides the total sale amount, number of sold items, and number of unsold items for the selected month.

## Bar Chart API

Endpoint: `GET /api/barChart`

Description: Returns a price range and the number of items in each range for the selected month.

## Pie Chart API

Endpoint: `GET /api/pieChart`

Description: Returns unique categories and the number of items in each category for the selected month.

## Combined Data API

Endpoint: `GET /api/combinedData`

Description: Combines data from the Statistics, Bar Chart, and Pie Chart APIs into a single response.

Prerequisites

Node.js (v14 or above) must be installed on your system.

npm (comes with Node.js) must be installed.

Running the Application

Open two terminal windows.

In the first terminal, start the frontend by running the following commands:

cd frontend
npm start

In the second terminal, start the backend by running the following commands:

cd backend
node app.js

Access the application by visiting http://localhost:3000 in your browser.

