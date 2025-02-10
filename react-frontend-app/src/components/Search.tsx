import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Alert, Container, Paper } from "@mui/material";
import "./Search.css";

interface SearchProps {
  token: string;
}

const Search: React.FC<SearchProps> = ({ token }) => {
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleNameSearch = async () => {
    setError(null);
    setResults([]);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/search_by_name/?name=${searchName}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.data && response.data.length > 0) {
        setResults(response.data);
      } else {
        setError("No results found for the given name.");
      }
    } catch (err) {
      setError("Search by name failed. Please try again.");
    }
  };

  const handlePhoneSearch = async () => {
    setError(null);
    setResults([]);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/search_by_phone_number/?phone_number=${searchPhone}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (response.data) {
        setResults([response.data]); // Wrap single object in array for uniform processing
      } else {
        setError("No results found for the given phone number.");
      }
    } catch (err) {
      setError("Search by phone number failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" className="search-container">
      <Paper elevation={3} className="search-box">
        <Typography variant="h4" className="title" gutterBottom>
          Search
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}

        {/* Search by Name */}
        <Box className="input-group">
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleNameSearch}>
            Search by Name
          </Button>
        </Box>

        {/* Search by Phone Number */}
        <Box className="input-group">
          <TextField
            label="Search by Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handlePhoneSearch}>
            Search by Phone Number
          </Button>
        </Box>

        {/* Display Results */}
        {results.length > 0 && (
          <Box className="results">
            <Typography variant="h6" gutterBottom>
              Results:
            </Typography>
            {results.map((result, index) => (
              <Box key={index} className="result-item">
                <Typography>Name: {result.name || "N/A"}</Typography>
                <Typography>Phone Number: {result.phone_number || "N/A"}</Typography>
                <Typography>Email: {result.email || "N/A"}</Typography>
                <Typography>Spam Count: {result.spam_count}</Typography>
                <Typography>Spam Severity: {result.spam_severity}</Typography>
                <Typography>Spam Insight: {result.spam_insight || "N/A"}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Search;
