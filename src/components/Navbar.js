import React, { useState } from 'react';
import { 
  Box, 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper,
  Button,
  Tooltip
} from '@mui/material';
import { 
  Home as HomeIcon, 
  School as SchoolIcon, 
  Quiz as QuizIcon, 
  Image as ImageIcon, 
  BarChart as BarChartIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ isMobile, currentPath }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  
  // Define navigation items based on authentication status
  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon />, alwaysShow: true },
    { label: 'Flashcards', path: '/flashcards', icon: <SchoolIcon />, alwaysShow: true },
    { label: 'Practice Test', path: '/practice', icon: <QuizIcon />, alwaysShow: true },
    { label: 'Road Signs', path: '/signs', icon: <ImageIcon />, alwaysShow: true },
    { label: 'Progress', path: '/progress', icon: <BarChartIcon />, alwaysShow: true },
  ];
  
  const handleNavigation = (path) => {
    navigate(path);
    if (menuOpen) setMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Current navigation value based on the path
  const currentValue = navItems.findIndex(item => item.path === currentPath);

  // Mobile bottom navigation
  if (isMobile) {
    return (
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={currentValue !== -1 ? currentValue : false}
          onChange={(event, newValue) => {
            if (newValue < navItems.length) {
              handleNavigation(navItems[newValue].path);
            }
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction 
              key={item.path} 
              label={item.label} 
              icon={item.icon} 
            />
          ))}
          {!currentUser ? (
            <BottomNavigationAction 
              label="Login" 
              icon={<LoginIcon />} 
              onClick={() => navigate('/login')}
            />
          ) : (
            <BottomNavigationAction 
              label="Logout" 
              icon={<LogoutIcon />} 
              onClick={handleLogout}
            />
          )}
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
        position: 'relative'
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
      
      {/* Auth button - positioned to the right */}
      <Box sx={{ 
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)'
      }}>
        {!currentUser ? (
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            size="small"
          >
            Login
          </Button>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={currentUser.username || 'User'}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
            </Tooltip>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navbar; 