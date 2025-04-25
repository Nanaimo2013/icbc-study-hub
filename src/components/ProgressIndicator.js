import React from 'react';
import { Box, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { CheckCircle, Error, Warning } from '@mui/icons-material';

const ProgressIndicator = ({ 
  value = 0, 
  variant = 'linear', 
  size = 'medium', 
  showLabel = true,
  showIcon = false,
  thickness = 4,
  height = 10,
  label = null,
  labelPosition = 'bottom',
  color = null // If null, will use automatic color based on value
}) => {
  // Determine color based on value if not specified
  const getProgressColor = (value) => {
    if (color) return color;
    if (value >= 80) return "success";
    if (value >= 60) return "warning";
    return "error";
  };
  
  // Determine icon based on value
  const getProgressIcon = (value) => {
    if (value >= 80) return <CheckCircle color="success" />;
    if (value >= 60) return <Warning color="warning" />;
    return <Error color="error" />;
  };
  
  // Determine size values
  const getSizeProps = (size) => {
    switch (size) {
      case 'small':
        return { 
          circularSize: 60, 
          linearHeight: height / 1.5, 
          typography: 'body2'
        };
      case 'large':
        return { 
          circularSize: 120, 
          linearHeight: height * 1.5, 
          typography: 'h6'
        };
      case 'medium':
      default:
        return { 
          circularSize: 80, 
          linearHeight: height, 
          typography: 'body1'
        };
    }
  };
  
  const sizeProps = getSizeProps(size);
  const progressColor = getProgressColor(value);
  const displayLabel = label || `${Math.round(value)}%`;
  
  // Linear progress indicator
  if (variant === 'linear') {
    return (
      <Box sx={{ width: '100%' }}>
        {showLabel && labelPosition === 'top' && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant={sizeProps.typography}>{displayLabel}</Typography>
            {showIcon && getProgressIcon(value)}
          </Box>
        )}
        
        <LinearProgress 
          variant="determinate" 
          value={value} 
          color={progressColor}
          sx={{ 
            height: sizeProps.linearHeight, 
            borderRadius: sizeProps.linearHeight / 2
          }} 
        />
        
        {showLabel && labelPosition === 'bottom' && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant={sizeProps.typography}>{displayLabel}</Typography>
            {showIcon && getProgressIcon(value)}
          </Box>
        )}
      </Box>
    );
  }
  
  // Circular progress indicator
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={value}
          color={progressColor}
          size={sizeProps.circularSize}
          thickness={thickness}
        />
        {showLabel && labelPosition === 'inside' && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant={sizeProps.typography} component="div" color="text.secondary">
              {displayLabel}
            </Typography>
          </Box>
        )}
      </Box>
      
      {showLabel && labelPosition === 'bottom' && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant={sizeProps.typography}>{displayLabel}</Typography>
          {showIcon && (
            <Box sx={{ ml: 1 }}>
              {getProgressIcon(value)}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProgressIndicator; 