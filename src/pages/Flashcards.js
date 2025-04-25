import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card, 
  CardContent, 
  Divider,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  NavigateNext, 
  NavigateBefore, 
  Refresh, 
  Bookmark, 
  BookmarkBorder,
  FilterList,
  Assignment,
  EmojiEvents,
  Report
} from '@mui/icons-material';

// Custom components
import Loader from '../components/Loader';
import StudyReport from '../components/StudyReport';
import { useNotification } from '../contexts/NotificationContext';

const Flashcards = ({ questions, updateProgress, isMobile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [studied, setStudied] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [reportData, setReportData] = useState({});
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [savedIncorrectQuestions, setSavedIncorrectQuestions] = useState([]);
  const [practiceIncorrectMode, setPracticeIncorrectMode] = useState(false);

  // Get notification context
  const { showSuccess, showInfo } = useNotification();

  // Define shuffleQuestions with useCallback - fixed to handle empty questions
  const shuffleQuestions = useCallback(() => {
    if (questions.length === 0) {
      setLoading(false); // Don't stay in loading state if no questions
      return;
    }
    
    setLoading(true);
    
    // Use a shorter timeout to improve responsiveness
    setTimeout(() => {
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled);
      setCurrentIndex(0);
      setShowAnswer(false);
      setCorrectAnswers(0);
      setStudied([]);
      setCompleted(false);
      setSessionStartTime(Date.now());
      setLoading(false);
    }, 500);
  }, [questions]);

  // Initialize with shuffled questions - fixed to handle empty questions
  useEffect(() => {
    // Only trigger shuffling if there are questions to shuffle
    if (questions && questions.length > 0) {
      shuffleQuestions();
    } else {
      // If no questions, set loading to false to prevent infinite loading
      setLoading(false);
    }
  }, [questions, shuffleQuestions]);

  // Filter questions by category
  useEffect(() => {
    if (questions.length === 0) {
      return; // Don't attempt filtering if no questions available
    }
    
    setLoading(true);
    
    // Immediate check to see if there are any questions to display
    let filtered = [...questions];
    if (category !== 'All') {
      filtered = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }
    
    if (filtered.length === 0) {
      // No questions match the filter, set empty array and stop loading
      setShuffledQuestions([]);
      setLoading(false);
      showInfo(`No flashcards found in category: ${category}`);
      return;
    }
    
    // Continue with normal flow - small timeout for better UX
    setTimeout(() => {
      // Shuffle the filtered questions
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled);
      
      // Reset state when filtering changes
      setCurrentIndex(0);
      setShowAnswer(false);
      setCorrectAnswers(0);
      setStudied([]);
      setCompleted(false);
      setSessionStartTime(Date.now());
      setLoading(false);
      
      showInfo(`Loaded ${shuffled.length} flashcards in category: ${category}`);
    }, 800); // Simulate loading delay
  }, [category, questions, showInfo]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (correct) => {
    if (correct) {
      setCorrectAnswers(correctAnswers + 1);
    }
    
    // Store answer data
    const currentQuestion = shuffledQuestions[currentIndex];
    const answerData = {
      question: currentQuestion.question,
      userAnswer: correct ? currentQuestion.answer : "Incorrect",
      correctAnswer: currentQuestion.answer,
      isCorrect: correct
    };
    
    // Update studied array with both the index and answer data
    setStudied([...studied, { index: currentIndex, data: answerData }]);
    
    // Move to next question after a short delay
    setTimeout(() => {
      setShowAnswer(false);
      
      setTimeout(() => {
        if (currentIndex < shuffledQuestions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          completeSession(correct);
        }
      }, 100);
    }, 300);
  };

  const completeSession = (lastCorrect) => {
    const finalCorrectAnswers = correctAnswers + (lastCorrect ? 1 : 0);
    const totalAnswered = studied.length + 1;
    const percentCorrect = Math.round((finalCorrectAnswers / totalAnswered) * 100);
    
    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
    
    // Prepare report data
    const reportData = {
      score: percentCorrect,
      totalQuestions: totalAnswered,
      correctAnswers: finalCorrectAnswers,
      timeSpent: timeSpent,
      category: category,
      answers: studied.map(item => item.data).concat(lastCorrect ? [{
        question: shuffledQuestions[currentIndex].question,
        userAnswer: shuffledQuestions[currentIndex].answer,
        correctAnswer: shuffledQuestions[currentIndex].answer,
        isCorrect: true
      }] : [{
        question: shuffledQuestions[currentIndex].question,
        userAnswer: "Incorrect",
        correctAnswer: shuffledQuestions[currentIndex].answer,
        isCorrect: false
      }])
    };
    
    setReportData(reportData);
    setCompleted(true);
    
    // Update progress in parent component
    updateProgress('flashcards', totalAnswered, finalCorrectAnswers);
    
    // Show notification
    if (percentCorrect >= 80) {
      showSuccess('Great job! You completed the flashcard session with a high score!');
    } else {
      showInfo('Flashcard session completed. Keep practicing to improve your score.');
    }
  };

  const handleNextCard = () => {
    // If answer shown, hide it first
    if (showAnswer) {
      setShowAnswer(false);
      
      setTimeout(() => {
        if (currentIndex < shuffledQuestions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          completeSession(false);
        }
      }, 300);
    } else {
      // If answer not shown, just move to next card
      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        completeSession(false);
      }
    }
  };

  const handlePrevCard = () => {
    // If answer shown, hide it first
    if (showAnswer) {
      setShowAnswer(false);
      
      setTimeout(() => {
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      }, 300);
    } else {
      // If answer not shown, just move to previous card
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const toggleBookmark = () => {
    if (bookmarked.includes(currentIndex)) {
      setBookmarked(bookmarked.filter(b => b !== currentIndex));
      showInfo('Flashcard removed from bookmarks');
    } else {
      setBookmarked([...bookmarked, currentIndex]);
      showInfo('Flashcard added to bookmarks');
    }
  };

  const resetFlashcards = () => {
    shuffleQuestions();
    showInfo('Starting a new flashcard session');
  };

  const handleFilterDialogOpen = () => {
    setShowFilterDialog(true);
  };

  const handleFilterDialogClose = () => {
    setShowFilterDialog(false);
  };

  const handleOpenDetailedReport = () => {
    setShowDetailedReport(true);
  };

  const handleCloseDetailedReport = () => {
    setShowDetailedReport(false);
  };

  const handleReport = () => {
    showInfo('Report feature coming soon. This will allow users to report inaccurate or problematic cards.');
  };

  // Get unique categories from questions
  const categories = ['All', ...new Set(questions.map(q => q.category))];

  // Handle saving incorrect questions for later practice
  const handleSaveIncorrect = (incorrectQuestionsData) => {
    // Convert the answer data into actual question objects
    const incorrectQs = incorrectQuestionsData.map(answer => {
      return shuffledQuestions.find(q => q.question === answer.question);
    }).filter(Boolean); // Remove any undefined values
    
    setSavedIncorrectQuestions(incorrectQs);
    localStorage.setItem('savedIncorrectFlashcards', JSON.stringify(incorrectQs));
    showSuccess('Incorrect questions saved for later practice');
    setShowDetailedReport(false);
  };

  // Handle practicing incorrect questions immediately
  const handlePracticeIncorrect = (incorrectQuestionsData) => {
    // Convert the answer data into actual question objects
    const incorrectQs = incorrectQuestionsData.map(answer => {
      return shuffledQuestions.find(q => q.question === answer.question);
    }).filter(Boolean); // Remove any undefined values
    
    if (incorrectQs.length > 0) {
      setPracticeIncorrectMode(true);
      setShuffledQuestions(incorrectQs);
      setCompleted(false);
      setCurrentIndex(0);
      setShowAnswer(false);
      setCorrectAnswers(0);
      setStudied([]);
      setShowDetailedReport(false);
      
      showInfo(`Starting practice with ${incorrectQs.length} incorrect questions.`);
    } else {
      showInfo('No incorrect questions to practice with.');
    }
  };

  // Load saved incorrect questions from localStorage
  useEffect(() => {
    const savedQuestions = localStorage.getItem('savedIncorrectFlashcards');
    if (savedQuestions) {
      try {
        setSavedIncorrectQuestions(JSON.parse(savedQuestions));
      } catch (e) {
        console.error('Error loading saved incorrect flashcards:', e);
      }
    }
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Loader text="Preparing flashcards..." />
      </Container>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          No flashcards available
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          There are no flashcards available for the selected category. Please try another category.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setCategory('All')}
          >
            View All Categories
          </Button>
          
          {savedIncorrectQuestions.length > 0 && (
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => {
                setPracticeIncorrectMode(true);
                setShuffledQuestions(savedIncorrectQuestions);
                showInfo(`Practicing with ${savedIncorrectQuestions.length} saved incorrect questions.`);
                setLoading(false);
              }}
            >
              Practice Saved Incorrect ({savedIncorrectQuestions.length})
            </Button>
          )}
        </Box>
      </Container>
    );
  }

  if (completed) {
    const percentCorrect = Math.round((correctAnswers / studied.length) * 100);
    
    return (
      <Container maxWidth="md">
        <Card elevation={3} sx={{ mt: 4, p: 3 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              {practiceIncorrectMode ? 'Incorrect Questions Practice Complete!' : 'Flashcard Session Complete!'}
            </Typography>
            
            <Box sx={{ mt: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <EmojiEvents 
                  color={percentCorrect >= 80 ? "warning" : "action"} 
                  sx={{ fontSize: 60 }}
                />
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Your Score
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                {percentCorrect}%
              </Typography>
              <Typography variant="body1">
                {correctAnswers} correct out of {studied.length} cards
              </Typography>
              
              <Box sx={{ mt: 3, mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={percentCorrect} 
                  sx={{ height: 20, borderRadius: 1 }} 
                />
              </Box>
              
              {practiceIncorrectMode && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Great job practicing your incorrect questions! This focused practice will help you improve your knowledge.
                </Typography>
              )}
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<Refresh />} 
                onClick={() => {
                  setPracticeIncorrectMode(false);
                  resetFlashcards();
                }}
              >
                Study New Cards
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<Assignment />}
                onClick={handleOpenDetailedReport}
              >
                View Detailed Report
              </Button>
              
              {savedIncorrectQuestions.length > 0 && !practiceIncorrectMode && (
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={() => {
                    setPracticeIncorrectMode(true);
                    setShuffledQuestions(savedIncorrectQuestions);
                    setCompleted(false);
                    setCurrentIndex(0);
                    setShowAnswer(false);
                    setCorrectAnswers(0);
                    setStudied([]);
                    showInfo(`Practicing with ${savedIncorrectQuestions.length} saved incorrect questions.`);
                  }}
                >
                  Practice Saved Incorrect ({savedIncorrectQuestions.length})
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
        
        {/* Detailed Report Dialog */}
        <Dialog
          open={showDetailedReport}
          onClose={handleCloseDetailedReport}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <StudyReport
              title={practiceIncorrectMode ? "Incorrect Questions Practice Report" : "Flashcard Session Report"}
              data={reportData}
              onClose={handleCloseDetailedReport}
              onSaveIncorrect={handleSaveIncorrect}
              onPracticeIncorrect={handlePracticeIncorrect}
            />
          </DialogContent>
        </Dialog>
      </Container>
    );
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1">
          {practiceIncorrectMode ? 'Practice Incorrect Questions' : 'Flashcards'}
        </Typography>
        
        <Box>
          <IconButton 
            onClick={handleFilterDialogOpen} 
            color="primary" 
            aria-label="filter cards"
            sx={{ mr: 1 }}
          >
            <FilterList />
          </IconButton>
          
          <Chip 
            label={`${currentIndex + 1} of ${shuffledQuestions.length}`} 
            color="primary" 
            variant="outlined" 
          />
        </Box>
      </Box>
      
      {practiceIncorrectMode && (
        <Box sx={{ mb: 3 }}>
          <Chip 
            color="secondary"
            label="Incorrect Questions Practice Mode" 
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      )}

      <Card 
        elevation={5} 
        sx={{ 
          minHeight: isMobile ? 250 : 300,
          borderRadius: 3,
          position: 'relative',
          mb: 3,
          perspective: '1000px'
        }}
      >
        {/* Front side - Question */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            p: isMobile ? 2 : 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: 3,
            bgcolor: 'background.paper',
            transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
            opacity: showAnswer ? 0 : 1,
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            backfaceVisibility: 'hidden',
            zIndex: showAnswer ? 0 : 1,
            pointerEvents: showAnswer ? 'none' : 'auto'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 2, 
            alignItems: 'center' 
          }}>
            <Chip 
              label={currentQuestion.category} 
              color="secondary" 
              size="small" 
            />
            
            <Box>
              <IconButton 
                onClick={toggleBookmark} 
                color="primary"
                aria-label={bookmarked.includes(currentIndex) ? "remove bookmark" : "add bookmark"}
                sx={{ mr: 1 }}
                size={isMobile ? "small" : "medium"}
              >
                {bookmarked.includes(currentIndex) ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
              
              <IconButton
                color="default"
                aria-label="report issue"
                size={isMobile ? "small" : "medium"}
                onClick={handleReport}
              >
                <Report fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant={isMobile ? "h6" : "h5"} component="h2" gutterBottom sx={{ 
            mt: isMobile ? 1 : 3, 
            mb: isMobile ? 2 : 4, 
            textAlign: 'center',
            fontWeight: 'medium',
            px: 2,
            fontSize: isMobile ? '1rem' : '1.3rem'
          }}>
            {currentQuestion.question}
          </Typography>
          
          <Box sx={{ mt: 'auto', textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleShowAnswer}
              sx={{ 
                minWidth: isMobile ? 150 : 200,
                py: isMobile ? 1 : 1.5,
                px: isMobile ? 2 : 3,
                borderRadius: 2,
                fontWeight: 'bold',
                boxShadow: 2,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 4
                },
                transition: 'all 0.3s ease',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              Show Answer
            </Button>
          </Box>
        </Box>
        
        {/* Back side - Answer */}
        <Box
          className="flashcard-answer"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            p: isMobile ? 2 : 4,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            bgcolor: 'background.paper',
            opacity: showAnswer ? 1 : 0,
            transform: showAnswer ? 'rotateY(0deg)' : 'rotateY(-180deg)',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            backfaceVisibility: 'hidden',
            zIndex: showAnswer ? 1 : 0,
            pointerEvents: showAnswer ? 'auto' : 'none'
          }}
        >
          <Typography variant={isMobile ? "h6" : "h5"} component="h2" gutterBottom sx={{ 
            textAlign: 'center',
            mb: isMobile ? 1 : 2,
            fontSize: isMobile ? '1rem' : '1.3rem'
          }}>
            Answer:
          </Typography>
          
          <Typography variant={isMobile ? "h5" : "h4"} color="primary" sx={{ 
            fontWeight: 'bold', 
            mb: isMobile ? 2 : 4, 
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            p: isMobile ? 1 : 2,
            mx: 'auto',
            maxWidth: '80%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}>
            {currentQuestion.answer}
          </Typography>
          
          <Divider sx={{ my: isMobile ? 1 : 3 }} />
          
          <Grid container spacing={isMobile ? 1 : 2} sx={{ mt: 'auto' }}>
            <Grid item xs={6}>
              <Button 
                variant="contained" 
                color="error" 
                fullWidth
                onClick={() => handleAnswer(false)}
                sx={{ 
                  py: isMobile ? 0.75 : 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3
                  },
                  transition: 'all 0.2s ease',
                  fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}
              >
                Got it Wrong
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button 
                variant="contained" 
                color="success" 
                fullWidth
                onClick={() => handleAnswer(true)}
                sx={{ 
                  py: isMobile ? 0.75 : 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3
                  },
                  transition: 'all 0.2s ease',
                  fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}
              >
                Got it Right
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<NavigateBefore />}
          onClick={handlePrevCard}
          disabled={currentIndex === 0}
          sx={{
            borderRadius: 2,
            px: isMobile ? 1 : 3,
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}
          size={isMobile ? "small" : "medium"}
        >
          Previous
        </Button>
        
        <Button 
          variant="outlined" 
          endIcon={<NavigateNext />}
          onClick={handleNextCard}
          sx={{
            borderRadius: 2,
            px: isMobile ? 1 : 3,
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}
          size={isMobile ? "small" : "medium"}
        >
          {currentIndex === shuffledQuestions.length - 1 ? 'Finish' : 'Skip'}
        </Button>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <LinearProgress 
          variant="determinate" 
          value={(currentIndex / shuffledQuestions.length) * 100} 
          sx={{
            height: 10,
            borderRadius: 5
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {studied.length} studied
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {correctAnswers} correct
          </Typography>
        </Box>
      </Box>
      
      {/* Filter Dialog */}
      <Dialog 
        open={showFilterDialog} 
        onClose={handleFilterDialogClose}
        fullWidth={isMobile}
        maxWidth="xs"
      >
        <DialogTitle>Filter Flashcards</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1, minWidth: 200 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Flashcards; 