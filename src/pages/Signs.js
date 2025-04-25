import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card, 
  CardContent, 
  CardMedia,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Divider,
  LinearProgress,
  Zoom
} from '@mui/material';
import { 
  NavigateNext, 
  NavigateBefore, 
  Refresh, 
  Info,
  CheckCircle,
  Close
} from '@mui/icons-material';

// Import sign images
// In a real app, these would be actual image imports
const signImages = {
  'Stop': 'https://www.icbc.com/driver-licensing/Documents/stop-sign.jpg',
  'Yield': 'https://www.icbc.com/driver-licensing/Documents/yield-sign.jpg',
  'Speed Limit': 'https://www.icbc.com/driver-licensing/Documents/speed-limit-sign.jpg',
  'School Zone': 'https://www.icbc.com/driver-licensing/Documents/school-zone-sign.jpg',
  'No Entry': 'https://www.icbc.com/driver-licensing/Documents/no-entry-sign.jpg',
  'Pedestrian Crossing': 'https://www.icbc.com/driver-licensing/Documents/pedestrian-crossing-sign.jpg',
  'Railway Crossing': 'https://www.icbc.com/driver-licensing/Documents/railway-crossing-sign.jpg',
  'Construction Zone': 'https://www.icbc.com/driver-licensing/Documents/construction-zone-sign.jpg',
  'Slippery Road': 'https://www.icbc.com/driver-licensing/Documents/slippery-road-sign.jpg',
  'No Parking': 'https://www.icbc.com/driver-licensing/Documents/no-parking-sign.jpg'
};

// Fallback image for signs without a specific image
const fallbackImage = 'https://via.placeholder.com/300x300?text=Sign+Image+Not+Available';

const Signs = ({ questions, updateProgress }) => {
  const [tabValue, setTabValue] = useState(0);
  const [signQuestions, setSignQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [currentSignInfo, setCurrentSignInfo] = useState(null);

  useEffect(() => {
    // Filter questions related to signs
    const filtered = questions.filter(q => q.category === 'signs' || q.category === 'Signs');
    setSignQuestions(filtered);
    
    // Log for debugging
    console.log('Signs component - Filtered questions:', filtered.length);
    console.log('Signs component - Total questions:', questions.length);
  }, [questions]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Reset states when switching tabs
    setCurrentIndex(0);
    setQuizMode(false);
    setShowAnswer(false);
    setSelectedAnswer('');
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer('');
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  const handleNextSign = () => {
    if (currentIndex < signQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer('');
    } else {
      // If in quiz mode, complete the quiz
      if (quizMode) {
        setQuizCompleted(true);
        updateProgress('signs', signQuestions.length, correctAnswers);
      } else {
        // In browse mode, loop back to the beginning
        setCurrentIndex(0);
      }
    }
  };

  const handlePrevSign = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setSelectedAnswer('');
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    if (answer === signQuestions[currentIndex].answer) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const resetQuiz = () => {
    // Shuffle questions for a new quiz
    const shuffled = [...signQuestions].sort(() => Math.random() - 0.5);
    setSignQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer('');
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  const openInfoDialog = (sign) => {
    setCurrentSignInfo(sign);
    setInfoDialogOpen(true);
  };

  const closeInfoDialog = () => {
    setInfoDialogOpen(false);
  };

  const getSignImage = (question) => {
    // Extract sign name from the question to match with our images
    const signName = question.answer;
    
    // Try to find exact match
    if (signImages[signName]) {
      return signImages[signName];
    }
    
    // Try to find partial match
    const partialMatch = Object.keys(signImages).find(key => 
      signName.includes(key) || key.includes(signName)
    );
    
    return partialMatch ? signImages[partialMatch] : fallbackImage;
  };

  if (signQuestions.length === 0) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Loading road signs...
        </Typography>
        <LinearProgress />
      </Container>
    );
  }

  // Current sign being viewed
  const currentSign = signQuestions[currentIndex];
  const signImage = getSignImage(currentSign);

  // Quiz complete view
  if (quizMode && quizCompleted) {
    const percentCorrect = Math.round((correctAnswers / signQuestions.length) * 100);
    
    return (
      <Container maxWidth="md">
        <Card elevation={3} sx={{ mt: 4, p: 3 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Road Signs Quiz Complete!
            </Typography>
            
            <Box sx={{ mt: 4, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Your Score
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                {percentCorrect}%
              </Typography>
              <Typography variant="body1">
                {correctAnswers} correct out of {signQuestions.length} signs
              </Typography>
              
              <Box sx={{ mt: 3, mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={percentCorrect} 
                  sx={{ height: 20, borderRadius: 1 }} 
                />
              </Box>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<Refresh />} 
                onClick={resetQuiz}
                sx={{ mx: 1 }}
              >
                Try Again
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                onClick={() => setQuizMode(false)}
                sx={{ mx: 1 }}
              >
                Browse Signs
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Road Signs Study
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}
        >
          <Tab label="Browse Signs" />
          <Tab label="Test Yourself" />
          <Tab label="Sign Gallery" />
        </Tabs>
        
        {/* Browse Signs Mode */}
        {tabValue === 0 && (
          <Box>
            <Card elevation={3}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    image={signImage}
                    alt={currentSign.answer}
                    sx={{ 
                      height: { xs: 200, md: 300 },
                      objectFit: 'contain',
                      p: 2,
                      backgroundColor: '#f5f5f5'
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {currentSign.answer}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {currentSign.question}
                    </Typography>
                    
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">
                        Sign {currentIndex + 1} of {signQuestions.length}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(currentIndex / (signQuestions.length - 1)) * 100} 
                        sx={{ mt: 1, mb: 2 }} 
                      />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          startIcon={<NavigateBefore />}
                          onClick={handlePrevSign}
                          disabled={currentIndex === 0}
                        >
                          Previous
                        </Button>
                        
                        <Button 
                          variant="contained" 
                          endIcon={<NavigateNext />}
                          onClick={handleNextSign}
                        >
                          Next
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={startQuiz}
              >
                Test Your Knowledge
              </Button>
            </Box>
          </Box>
        )}
        
        {/* Test Yourself Mode */}
        {tabValue === 1 && (
          <Box>
            {!quizMode ? (
              <Card elevation={3} sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Road Signs Quiz
                </Typography>
                <Typography variant="body1" paragraph>
                  Test your knowledge of road signs. You'll be shown a sign and asked to identify what it means.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={startQuiz}
                  sx={{ mt: 2 }}
                >
                  Start Quiz
                </Button>
              </Card>
            ) : (
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      What does this sign mean?
                    </Typography>
                    <Chip 
                      label={`${currentIndex + 1} of ${signQuestions.length}`}
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CardMedia
                      component="img"
                      image={signImage}
                      alt="Road Sign"
                      sx={{ 
                        height: 200,
                        width: 'auto',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1
                      }}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Grid container spacing={2}>
                    {currentSign.choices?.map((choice, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Button
                          variant={selectedAnswer === choice ? 'contained' : 'outlined'}
                          color={
                            showAnswer
                              ? choice === currentSign.answer
                                ? 'success'
                                : selectedAnswer === choice
                                ? 'error'
                                : 'primary'
                              : 'primary'
                          }
                          fullWidth
                          onClick={() => !showAnswer && handleAnswerSelect(choice)}
                          sx={{ py: 1.5, justifyContent: 'flex-start', px: 3 }}
                          disabled={showAnswer}
                          startIcon={showAnswer && (
                            choice === currentSign.answer 
                              ? <CheckCircle /> 
                              : selectedAnswer === choice 
                              ? <Close /> 
                              : null
                          )}
                        >
                          {choice}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {showAnswer && (
                    <Box sx={{ mt: 3, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedAnswer === currentSign.answer 
                          ? '✓ Correct!' 
                          : '✗ Incorrect. The correct answer is:'
                        }
                      </Typography>
                      {selectedAnswer !== currentSign.answer && (
                        <Typography variant="body1" color="success.main" sx={{ mt: 1 }}>
                          {currentSign.answer}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    {showAnswer ? (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        endIcon={<NavigateNext />}
                        onClick={handleNextSign}
                        fullWidth
                      >
                        {currentIndex === signQuestions.length - 1 ? 'See Results' : 'Next Sign'}
                      </Button>
                    ) : (
                      <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={() => setQuizMode(false)}
                      >
                        Exit Quiz
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
        
        {/* Sign Gallery Mode */}
        {tabValue === 2 && (
          <Box>
            <Grid container spacing={3}>
              {signQuestions.map((sign, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={getSignImage(sign)}
                        alt={sign.answer}
                        sx={{ 
                          objectFit: 'contain',
                          backgroundColor: '#f5f5f5',
                          p: 1
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom noWrap>
                          {sign.answer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: 40
                        }}>
                          {sign.question.replace('What does a', '').replace('sign indicate?', '').trim()}
                        </Typography>
                      </CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                        <IconButton 
                          color="primary"
                          onClick={() => openInfoDialog(sign)}
                          aria-label={`Learn more about ${sign.answer}`}
                        >
                          <Info />
                        </IconButton>
                      </Box>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      
      {/* Sign Info Dialog */}
      <Dialog 
        open={infoDialogOpen} 
        onClose={closeInfoDialog}
        maxWidth="md"
      >
        {currentSignInfo && (
          <>
            <DialogTitle>{currentSignInfo.answer}</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img 
                      src={getSignImage(currentSignInfo)} 
                      alt={currentSignInfo.answer} 
                      style={{ 
                        maxWidth: '100%', 
                        height: 'auto',
                        maxHeight: 200,
                        objectFit: 'contain'
                      }} 
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="body1" paragraph>
                    {currentSignInfo.question}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    This sign belongs to the <Chip label={currentSignInfo.category} size="small" color="primary" /> category.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    When you encounter this sign, you should {currentSignInfo.answer.toLowerCase()}.
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeInfoDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Signs; 