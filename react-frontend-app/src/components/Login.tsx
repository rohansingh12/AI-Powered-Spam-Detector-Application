import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  Paper, 
  Container,
  InputAdornment
} from "@mui/material";
import { AccountCircle, LockRounded } from "@mui/icons-material";

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        username,
        password,
      });
      const token = response.data.Token;
      onLogin(token);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="loginContainer"><Container maxWidth="xs">
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
        Sign In
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ width: '100%', mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockRounded color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          type="submit" 
          fullWidth 
          variant="contained" 
          color="primary"
          sx={{ mt: 3, py: 1.5 }}
        >
          Sign In
        </Button>
      </Box>
    </Paper>
  </Container></div>
  );
};

export default Login;
