import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card, 
  CardContent, 
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { 
  CheckCircleOutline, 
  HighlightOff, 
  Refresh, 
  Timer,
  Assignment,
  ReportProblem,
  Error
} from '@mui/icons-material';

// Custom components
import Loader from '../components/Loader';
import StudyReport from '../components/StudyReport';
import { useNotification } from '../contexts/NotificationContext';

const Practice = ({ questions, updateProgress }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(1200); // 20 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [questionsPerTest] = useState(20);
  const [loading, setLoading] = useState(true);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [reportData, setReportData] = useState({});
  const [showReportIssueDialog, setShowReportIssueDialog] = useState(false);
  const [reportIssueData, setReportIssueData] = useState({ 
    questionId: null, 
    description: '' 
  });
  const [savedIncorrectQuestions, setSavedIncorrectQuestions] = useState([]);
  const [practiceIncorrectMode, setPracticeIncorrectMode] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  // Get notification context
  const { showSuccess, showError, showInfo } = useNotification();

  // Define handleSubmitTest with useCallback
  const handleSubmitTest = useCallback(() => {
    setShowResults(true);
    setTimerActive(false);
    
    // Calculate final score
    const percentCorrect = Math.round((score / shuffledQuestions.length) * 100);
    const passed = percentCorrect >= 80;
    
    // Create report data
    setReportData({
      score: percentCorrect,
      totalQuestions: shuffledQuestions.length,
      correctAnswers: score,
      timeSpent: 1200 - timeRemaining, // Calculate time spent
      category: 'Mixed',
      answers: answers
    });
    
    // Update progress in parent component
    updateProgress('practice', shuffledQuestions.length, score);
    
    // Show notification
    if (passed) {
      showSuccess('Congratulations! You passed the practice test!');
    } else {
      showInfo('Practice test completed. Review your answers to improve.');
    }
  }, [updateProgress, shuffledQuestions.length, score, answers, timeRemaining, showSuccess, showInfo]);

  // Initialize with shuffled questions
  useEffect(() => {
    setLoading(true);
    if (questions.length > 0) {
      setTimeout(() => {
        const shuffled = [...questions]
          .sort(() => Math.random() - 0.5)
          .slice(0, questionsPerTest);
        setShuffledQuestions(shuffled);
        setLoading(false);
      }, 800); // Simulate loading delay
    }
  }, [questions, questionsPerTest]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      clearInterval(interval);
      setTimerActive(false);
      handleSubmitTest();
      showInfo('Time is up! Your test has been submitted automatically.');
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, handleSubmitTest, showInfo]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const startTest = () => {
    setTestStarted(true);
    setTimerActive(true);
    showInfo('Practice test started. You have 20 minutes to complete it.');
  };

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    // Save the answer
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    const newAnswer = {
      question: currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect
    };
    
    setAnswers([...answers, newAnswer]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      handleSubmitTest();
    }
  };

  const handleConfirmSubmit = () => {
    setConfirmSubmit(true);
  };

  const restartTest = () => {
    // Shuffle questions again
    setLoading(true);
    setTimeout(() => {
      const shuffled = [...questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, questionsPerTest);
      setShuffledQuestions(shuffled);
      
      // Reset all state
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setScore(0);
      setAnswers([]);
      setShowResults(false);
      setTimeRemaining(1200);
      setTestStarted(false);
      setTimerActive(false);
      setConfirmSubmit(false);
      setLoading(false);
      showInfo('New practice test ready. Good luck!');
    }, 800); // Simulate loading delay
  };

  const handleOpenDetailedReport = () => {
    setShowDetailedReport(true);
  };

  const handleCloseDetailedReport = () => {
    setShowDetailedReport(false);
  };

  const handleReportIssue = (questionId) => {
    setReportIssueData({ questionId, description: '' });
    setShowReportIssueDialog(true);
  };

  const handleReportIssueSubmit = () => {
    // Here you would typically send this to your backend
    console.log('Issue reported:', reportIssueData);
    showSuccess('Thank you for reporting this issue. We will review it shortly.');
    setShowReportIssueDialog(false);
  };

  // Handle saving incorrect questions for later practice
  const handleSaveIncorrect = (incorrectQuestionsData) => {
    // Get the actual question objects based on the answers data
    const incorrectQs = incorrectQuestionsData.map(answer => {
      return shuffledQuestions.find(q => q.question === answer.question);
    }).filter(Boolean); // Remove any undefined values
    
    setSavedIncorrectQuestions(incorrectQs);
    localStorage.setItem('savedIncorrectQuestions', JSON.stringify(incorrectQs));
    showSuccess('Incorrect questions saved for later practice');
    setShowDetailedReport(false);
  };

  // Handle practicing incorrect questions immediately
  const handlePracticeIncorrect = (incorrectQuestionsData) => {
    // Get the actual question objects based on the answers data
    const incorrectQs = incorrectQuestionsData.map(answer => {
      return shuffledQuestions.find(q => q.question === answer.question);
    }).filter(Boolean); // Remove any undefined values
    
    if (incorrectQs.length > 0) {
      setIncorrectQuestions(incorrectQs);
      setPracticeIncorrectMode(true);
      setShowResults(false);
      setShowDetailedReport(false);
      
      // Reset necessary state for new practice session
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setScore(0);
      setAnswers([]);
      setShuffledQuestions(incorrectQs);
      
      showInfo(`Starting practice with ${incorrectQs.length} incorrect questions.`);
    } else {
      showError('No valid incorrect questions to practice with.');
    }
  };

  // Load saved incorrect questions from localStorage
  useEffect(() => {
    const savedQuestions = localStorage.getItem('savedIncorrectQuestions');
    if (savedQuestions) {
      try {
        setSavedIncorrectQuestions(JSON.parse(savedQuestions));
      } catch (e) {
        console.error('Error loading saved incorrect questions:', e);
      }
    }
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Loader text="Preparing your practice test..." />
      </Container>
    );
  }

  if (!testStarted) {
    return (
      <Container maxWidth="md">
        <Card elevation={3} sx={{ mt: 4, p: 3 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              ICBC Knowledge Test Practice
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mt: 3 }}>
              This practice test simulates the actual ICBC knowledge test with randomized questions.
              You will have 20 minutes to answer {questionsPerTest} questions.
            </Typography>
            
            <Typography variant="body1" paragraph>
              The passing score is 80% or higher. Good luck!
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={startTest}
              >
                Start Practice Test
              </Button>
              
              {savedIncorrectQuestions.length > 0 && (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    setIncorrectQuestions(savedIncorrectQuestions);
                    setPracticeIncorrectMode(true);
                    setTestStarted(true);
                    setShuffledQuestions(savedIncorrectQuestions);
                    showInfo(`Practicing with ${savedIncorrectQuestions.length} saved questions.`);
                  }}
                >
                  Practice Saved Questions ({savedIncorrectQuestions.length})
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (showResults) {
    const percentCorrect = Math.round((score / shuffledQuestions.length) * 100);
    const passed = percentCorrect >= 80;
    
    return (
      <Container maxWidth="md">
        <Card elevation={3} sx={{ p: 3, mb: 4 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              {practiceIncorrectMode ? 'Practice Session Results' : 'Practice Test Results'}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3 }}>
              {passed ? (
                <CheckCircleOutline color="success" sx={{ fontSize: 60, mr: 2 }} />
              ) : (
                <HighlightOff color="error" sx={{ fontSize: 60, mr: 2 }} />
              )}
              <Typography variant="h5">
                {passed ? 'Passed!' : 'Needs Improvement'}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Your Score: {score} out of {shuffledQuestions.length} ({percentCorrect}%)
            </Typography>
            
            <LinearProgress 
              variant="determinate" 
              value={percentCorrect} 
              color={passed ? "success" : "error"}
              sx={{ height: 20, borderRadius: 1, my: 2 }} 
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Passing score: 80%
            </Typography>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Refresh />}
                onClick={restartTest}
              >
                Take Another Test
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<Assignment />}
                onClick={handleOpenDetailedReport}
              >
                View Detailed Report
              </Button>

              {incorrectQuestions.length > 0 && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Error />}
                  onClick={() => handlePracticeIncorrect(incorrectQuestions)}
                >
                  Practice Incorrect ({incorrectQuestions.length})
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Question Review
        </Typography>
        
        {answers.map((answer, index) => (
          <Paper key={index} elevation={2} sx={{ p: 3, mb: 2, borderLeft: 6, borderColor: answer.isCorrect ? 'success.main' : 'error.main' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Question {index + 1}
              </Typography>
              
              <Box>
                <Chip 
                  icon={answer.isCorrect ? <CheckCircleOutline /> : <HighlightOff />}
                  label={answer.isCorrect ? "Correct" : "Incorrect"}
                  color={answer.isCorrect ? "success" : "error"}
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                
                <Chip
                  icon={<ReportProblem />}
                  label="Report Issue"
                  color="default"
                  variant="outlined"
                  onClick={() => handleReportIssue(index)}
                  size="small"
                />
              </Box>
            </Box>
            
            <Typography variant="body1" paragraph>
              {answer.question}
            </Typography>
            
            <Box sx={{ ml: 2, mb: 2 }}>
              <Typography variant="body2" color={answer.isCorrect ? "success.main" : "error.main"}>
                Your answer: {answer.userAnswer}
              </Typography>
              
              {!answer.isCorrect && (
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  Correct answer: {answer.correctAnswer}
                </Typography>
              )}
            </Box>
          </Paper>
        ))}
        
        {/* Detailed Report Dialog */}
        <Dialog
          open={showDetailedReport}
          onClose={handleCloseDetailedReport}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <StudyReport
              title={practiceIncorrectMode ? "Practice Session Report" : "Practice Test Report"}
              data={reportData}
              onClose={handleCloseDetailedReport}
              onSaveIncorrect={handleSaveIncorrect}
              onPracticeIncorrect={handlePracticeIncorrect}
            />
          </DialogContent>
        </Dialog>
        
        {/* Report Issue Dialog */}
        <Dialog
          open={showReportIssueDialog}
          onClose={() => setShowReportIssueDialog(false)}
        >
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Please describe the issue with this question:
            </DialogContentText>
            <FormControl fullWidth>
              <FormLabel>Issue Description</FormLabel>
              <textarea
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  marginTop: '8px',
                  borderRadius: '4px',
                  borderColor: '#ccc'
                }}
                value={reportIssueData.description}
                onChange={(e) => setReportIssueData({
                  ...reportIssueData,
                  description: e.target.value
                })}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowReportIssueDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReportIssueSubmit} 
              variant="contained" 
              color="primary"
              disabled={!reportIssueData.description.trim()}
            >
              Submit Report
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Practice Test
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Timer color={timeRemaining < 300 ? "error" : "primary"} sx={{ mr: 1 }} />
          <Typography 
            variant="h6" 
            color={timeRemaining < 300 ? "error" : "primary"}
            fontWeight="bold"
          >
            {formatTime(timeRemaining)}
          </Typography>
        </Box>
      </Box>
      
      <Stepper 
        activeStep={currentQuestionIndex} 
        alternativeLabel 
        sx={{ mb: 3, display: { xs: 'none', md: 'flex' } }}
      >
        {shuffledQuestions.slice(0, 10).map((_, index) => (
          <Step key={index} completed={index < answers.length}>
            <StepLabel></StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <LinearProgress 
        variant="determinate" 
        value={(currentQuestionIndex / shuffledQuestions.length) * 100} 
        sx={{ mb: 3, display: { md: 'none' } }}
      />
      
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Chip 
              label={`Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`} 
              color="primary" 
              variant="outlined" 
            />
            
            <Chip 
              label={currentQuestion.category} 
              color="secondary" 
              size="small" 
            />
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            {currentQuestion.question}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
            <FormLabel component="legend" sx={{ mb: 2 }}>Select your answer:</FormLabel>
            <RadioGroup 
              aria-label="quiz" 
              name="quiz" 
              value={selectedAnswer} 
              onChange={handleAnswerSelect}
            >
              {currentQuestion.choices.map((choice, index) => (
                <FormControlLabel 
                  key={index} 
                  value={choice} 
                  control={
                    <Radio 
                      sx={{ 
                        '& .MuiSvgIcon-root': { fontSize: 28 } 
                      }} 
                    />
                  } 
                  label={
                    <Typography variant="body1">{choice}</Typography>
                  }
                  sx={{ 
                    mb: 1, 
                    p: 1, 
                    borderRadius: 1,
                    '&:hover': { 
                      backgroundColor: 'action.hover' 
                    } 
                  }} 
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="contained" 
          color="primary" 
          disabled={!selectedAnswer}
          onClick={handleNextQuestion}
          size="large"
          sx={{ px: 4 }}
        >
          {currentQuestionIndex === shuffledQuestions.length - 1 ? 'Submit' : 'Next'}
        </Button>
        
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleConfirmSubmit}
        >
          End Test
        </Button>
      </Box>
      
      {/* Confirm Submit Dialog */}
      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Submit your test?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to submit your test? You have completed {answers.length} of {shuffledQuestions.length} questions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSubmit(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitTest} color="primary" autoFocus>
            Submit Test
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Practice; 