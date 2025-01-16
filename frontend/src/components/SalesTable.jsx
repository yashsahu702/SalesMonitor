import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, MenuItem, Select, FormControl, InputLabel, Pagination, Box, Typography, Paper } from '@mui/material';
import axios from 'axios';

const SalesTable = ({ appMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState("March");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    appMonth(month);
    fetchTransactions();
  }, [month, searchText, page]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/allSales', {
        params: {
          month,
          search: searchText,
          page,
          perPage,
        },
      });
      setTransactions(response.data.sales);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    setPage(1); // Reset page when month changes
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ marginTop: 4, padding: 2, backgroundColor: "#f4f6f9", borderRadius: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: "#2c3e50", fontWeight: "bold" }}>
        Sales Transactions - {month}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <FormControl sx={{ width: 150 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            label="Month"
            onChange={handleMonthChange}
            sx={{
              borderRadius: '8px',
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              "& .MuiSelect-select": {
                paddingLeft: "10px",
              },
            }}
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search"
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
          fullWidth
          sx={{
            maxWidth: "400px",
            borderRadius: '8px',
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            "& .MuiInputBase-root": {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#34495e", backgroundColor: "#ecf0f1", borderBottom: "2px solid #3498db" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#34495e", backgroundColor: "#ecf0f1", borderBottom: "2px solid #3498db" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#34495e", backgroundColor: "#ecf0f1", borderBottom: "2px solid #3498db" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#34495e", backgroundColor: "#ecf0f1", borderBottom: "2px solid #3498db" }}>Sold</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#34495e", backgroundColor: "#ecf0f1", borderBottom: "2px solid #3498db" }}>Date of Sale</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction._id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    cursor: "pointer",
                  },
                }}
              >
                <TableCell>{transaction.title}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.price}</TableCell>
                <TableCell>{transaction.sold ? "Sold" : "Not Sold"}</TableCell>
                <TableCell>{new Date(transaction.dateOfSale).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination
          count={Math.ceil(totalCount / perPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ backgroundColor: "#ffffff", borderRadius: '8px', boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
        />
      </Box>
    </Box>
  );
};

export default SalesTable;
