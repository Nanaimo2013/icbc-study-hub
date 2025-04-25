import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = ({ darkMode, toggleDarkMode, isMobile }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppBar 
      position="static" 
      elevation={3}
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.primary.main,
      }}
    >
      <Toolbar sx={{ 
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        height: { xs: '56px', sm: '64px' }
      }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexGrow: 1, 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              letterSpacing: '0.5px'
            }}
          >
            ICBC Study Hub
          </Typography>
        </Box>
        <IconButton 
          color="inherit" 
          onClick={toggleDarkMode} 
          aria-label="toggle dark mode"
          size={isMobile ? "small" : "medium"}
          sx={{ ml: 1 }}
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 