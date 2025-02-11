import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";

interface MarkSpamProps {
  token: string;
}

const MarkSpam: React.FC<MarkSpamProps> = ({ token }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [comment, setComment] = useState(""); // State for user comment
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMarkSpam = async () => {
    setError(null);
    setMessage(null);

    try {
      await axios.post(
        "https://ai-powered-spam-detector-application.onrender.com/spams/",
        { phone_number: phoneNumber, comment }, // Send comment along with phone number
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setMessage("Number marked as spam successfully.");
      setPhoneNumber(""); // Clear phone number field after submission
      setComment(""); // Clear comment field after submission
    } catch (err: any) {
      setError("Failed to mark as spam. Please try again.");
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5">Mark as Spam</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <TextField
        label="Comment" // Label for comment field
        variant="outlined"
        fullWidth
        margin="normal"
        multiline // Allow multiple lines for comments
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleMarkSpam}
        sx={{ mt: 2 }}
      >
        Mark as Spam
      </Button>
    </Box>
  );
};

export default MarkSpam;
