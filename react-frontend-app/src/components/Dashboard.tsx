import React, { useState } from "react";
import {  
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Container,
  Tabs,
  Tab,
  Grid,
  Paper
} from "@mui/material";
import Search from "./Search";
import MarkSpam from "./MarkSpam";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [tabValue, setTabValue] = useState(0);
  const navigate=useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogout= () => {
    onLogout();
    navigate("/");
  }

  return (
    <div className="dashboard-container">
      <Container maxWidth="lg">
      <Card elevation={3}>
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={8}>
              <Typography 
                variant="h4" 
                color="primary" 
                display="inline"
              >
                Dashboard
              </Typography>
            </Grid>
            <Grid item xs={4} display="flex" justifyContent="flex-end">
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleLogout}
                size="medium"
              >
                Logout
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="fullWidth"
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  mb: 2 
                }}
              >
                <Tab label="Search" sx={{ width: '50%' }} />
                <Tab label="Mark Spam" sx={{ width: '50%' }} />
              </Tabs>
            </Grid>

            <Grid 
              item 
              xs={12} 
              sx={{
                height: '700px',  // Fixed height
                overflow: 'auto'  // Scrollable if content exceeds
              }}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  width: '100%' 
                }}
              >
                {tabValue === 0 && <Search token={token} />}
                {tabValue === 1 && <MarkSpam token={token} />}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
    </div>
  );
};

export default Dashboard;
