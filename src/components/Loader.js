import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ text = 'Loading...', size = 40 }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        py: 4
      }}
    >
      <CircularProgress size={size} thickness={4} />
      {text && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mt: 2 }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader; 