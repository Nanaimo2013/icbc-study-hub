import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Alert,
  Container 
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const validateForm = () => {
    setError('');

    if (!username) {
      setError('Username is required');
      return false;
    }
    
    if (tab === 1 && !email) { // Registration requires email
      setError('Email is required');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (tab === 1 && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (tab === 1 && password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (tab === 0) { // Login
        await login(username, password);
      } else { // Register
        await register(username, email, password);
      }
      navigate('/'); // Redirect to home page after successful auth
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Tabs value={tab} onChange={handleTabChange} centered variant="fullWidth">
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {(error || authError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || authError}
            </Alert>
          )}
          
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          
          {tab === 1 && (
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {tab === 1 && (
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {tab === 0 ? 'Login' : 'Register'}
          </Button>
          
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            {tab === 0 ? "Don't have an account? Switch to Register" : "Already have an account? Switch to Login"}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 