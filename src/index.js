import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bcd4',
    },
    secondary: {
      main: '#0077aa',
    },
    background: {
      default: '#121212',
      paper: '#1f1f1f',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || window.location.origin;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Initialize axios interceptors for error handling
axios.interceptors.response.use(
  response => response,
  error => {
    // Handle common errors
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle token expiration
      if (error.response.status === 401) {
        // Clear auth data if it's an auth error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else caused the error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
); 