import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, Typography, useMediaQuery, CssBaseline, ThemeProvider } from '@mui/material';

// Custom theme
import createAppTheme from './theme';

// Components
import Navbar from './components/Navbar';
import Header from './components/Header';
import Loader from './components/Loader';
import Notifications from './components/Notifications';

// Pages
import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import Practice from './pages/Practice';
import Signs from './pages/Signs';
import Progress from './pages/Progress';

// Import the question service
import questionService from './data/questionService';

// Context
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  const [questions, setQuestions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    flashcards: { total: 0, correct: 0 },
    practice: { total: 0, correct: 0 },
    signs: { total: 0, correct: 0 }
  });
  
  // Create the theme based on dark mode preference
  const theme = createAppTheme(darkMode);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  useEffect(() => {
    // Load questions using the question service
    setLoading(true);
    
    try {
      // Load questions from questionService immediately without delay
      const allQuestions = questionService.getAllQuestions();
      
      // Check if questions are loaded successfully
      if (allQuestions && allQuestions.length > 0) {
        setQuestions(allQuestions);
        console.log(`Loaded ${allQuestions.length} questions successfully`);
        setLoading(false);
      } else {
        console.error('No questions were loaded from questionService');
        setError('No questions available. Please check your data source.');
        setLoading(false);
      }
      
      // Load saved progress from questionService
      const userProgress = questionService.getUserProgress();
      if (userProgress) {
        // Map the progress data structure if needed
        const mappedProgress = {
          flashcards: userProgress.flashcards || { total: 0, correct: 0 },
          practice: userProgress.practice || { total: 0, correct: 0 },
          signs: userProgress.signs || { total: 0, correct: 0 }
        };
        setProgress(mappedProgress);
      }
      
      // Load theme preference from questionService or localStorage
      const userSettings = questionService.getSettings();
      if (userSettings && userSettings.theme) {
        setDarkMode(userSettings.theme === 'dark');
      }
    } catch (err) {
      console.error('Error loading application data:', err);
      setError('Failed to load questions. Please try again later.');
      setLoading(false);
    }
  }, []);

  // Save progress through questionService when it changes
  useEffect(() => {
    // Skip initial empty progress
    if (progress.flashcards.total === 0 && 
        progress.practice.total === 0 && 
        progress.signs.total === 0) {
      return;
    }
    
    // We don't need to save progress here as each component calls
    // updateProgress which already saves to questionService
  }, [progress]);

  // Save theme preference through questionService when it changes
  useEffect(() => {
    questionService.updateSettings({ theme: darkMode ? 'dark' : 'light' });
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const updateProgress = (module, totalQuestions, correctAnswers) => {
    // Update local state
    setProgress(prevProgress => ({
      ...prevProgress,
      [module]: {
        total: prevProgress[module].total + totalQuestions,
        correct: prevProgress[module].correct + correctAnswers
      }
    }));
    
    // Update in questionService
    questionService.updateProgress(module, totalQuestions, correctAnswers);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 2
      }}>
        <Loader text="Loading ICBC Study Hub..." size={60} />
        <Typography variant="body2" color="text.secondary">
          Preparing your study materials...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', p: 3 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          // Add bottom padding on mobile to account for the bottom navigation
          pb: isMobile ? '56px' : 0 
        }}>
          <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} isMobile={isMobile} />
          <Navbar isMobile={isMobile} currentPath={location.pathname} />
          <Notifications />
          
          <Box component="main" sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            backgroundColor: theme.palette.background.default 
          }}>
            <Routes>
              <Route path="/" element={<Home progress={progress} isMobile={isMobile} />} />
              <Route 
                path="/flashcards" 
                element={<Flashcards questions={questions.filter(q => q.category !== 'signs')} updateProgress={updateProgress} isMobile={isMobile} />} 
              />
              <Route 
                path="/practice" 
                element={<Practice questions={questions} updateProgress={updateProgress} isMobile={isMobile} />} 
              />
              <Route 
                path="/signs" 
                element={<Signs questions={questions.filter(q => q.category === 'signs')} updateProgress={updateProgress} isMobile={isMobile} />} 
              />
              <Route 
                path="/progress" 
                element={<Progress progress={progress} isMobile={isMobile} />} 
              />
            </Routes>
          </Box>
        </Box>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App; 