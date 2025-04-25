import React, { useState } from 'react';
import { 
  Box, 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper
} from '@mui/material';
import { 
  Home as HomeIcon, 
  School as SchoolIcon, 
  Quiz as QuizIcon, 
  Image as ImageIcon, 
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Flashcards', path: '/flashcards', icon: <SchoolIcon /> },
  { label: 'Practice Test', path: '/practice', icon: <QuizIcon /> },
  { label: 'Road Signs', path: '/signs', icon: <ImageIcon /> },
  { label: 'Progress', path: '/progress', icon: <BarChartIcon /> },
];

const Navbar = ({ isMobile, currentPath }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleNavigation = (path) => {
    navigate(path);
    if (menuOpen) setMenuOpen(false);
  };

  // Current navigation value based on the path
  const currentValue = navItems.findIndex(item => item.path === currentPath);

  // Mobile bottom navigation
  if (isMobile) {
    return (
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={currentValue}
          onChange={(event, newValue) => {
            handleNavigation(navItems[newValue].path);
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction 
              key={item.path} 
              label={item.label} 
              icon={item.icon} 
            />
          ))}
        </BottomNavigation>
      </Paper>
    );
  }

  // Desktop horizontal navbar
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        backgroundColor: 'background.paper',
        boxShadow: 1,
        mb: 3,
      }}
      component="nav"
    >
      {navItems.map((item) => (
        <Box 
          key={item.path} 
          sx={{ 
            p: 2,
            color: currentPath === item.path ? 'primary.main' : 'text.primary',
            fontWeight: currentPath === item.path ? 'bold' : 'normal',
            borderBottom: currentPath === item.path ? 2 : 0,
            borderColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
          onClick={() => handleNavigation(item.path)}
        >
          <Box sx={{ mr: 1 }}>{item.icon}</Box>
          {item.label}
        </Box>
      ))}
    </Box>
  );
};

export default Navbar; 