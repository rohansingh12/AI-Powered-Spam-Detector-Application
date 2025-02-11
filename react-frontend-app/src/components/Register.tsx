import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Register.css';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert, 
  Box,
  InputAdornment
} from "@mui/material";
import { 
  Person, 
  Email, 
  Phone, 
  Lock 
} from '@mui/icons-material';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("https://ai-powered-spam-detector-application.onrender.com/register/", {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phoneNumber,
        password: formData.password,
      });
      
      alert("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="registerContainer"><Container maxWidth="xs">
    <Paper 
      elevation={6} 
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4,
        borderRadius: 2
      }}
    >
      <Typography 
        component="h1" 
        variant="h5" 
        color="primary" 
        sx={{ mb: 3 }}
      >
        Create Your Account
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ width: '100%', mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ width: '100%' }}
      >
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={formData.name}
          onChange={handleChange('name')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="action" />
              </InputAdornment>
            ),
          }}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange('phoneNumber')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone color="action" />
              </InputAdornment>
            ),
          }}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
          }}
          required
        />

        <Button 
          type="submit" 
          fullWidth 
          variant="contained" 
          color="primary"
          sx={{ 
            mt: 3, 
            py: 1.5,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          Register
        </Button>
      </Box>
    </Paper>
  </Container></div>
  );
};

export default Register;
