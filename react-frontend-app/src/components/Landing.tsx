import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Paper 
} from "@mui/material";
import './Landing.css';
const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landingContainer">
      <Container maxWidth="md">
      <Grid 
        container 
        spacing={2} 
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh',
        marginTop: '-20%', }}
      >
        <Grid item>
          <Typography 
            variant="h2" 
            align="center"
            color="primary"
            sx={{
              fontWeight: 700,
              marginBottom: 4,
              background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginTop: '-50px',
            }}
          >
            Welcome to the Application
          </Typography>
        </Grid>

        <Grid item xs={12} sm={8} md={6}>
          <Paper 
            elevation={6}
            sx={{
              padding: 4,
              borderRadius: 3,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{ 
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 6px 10px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{ 
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 6px 10px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
};

export default Landing;
