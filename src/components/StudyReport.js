import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Avatar,
  IconButton
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Category,
  Visibility,
  ExpandMore,
  School,
  BarChart,
  Speed,
  Error,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`study-report-tabpanel-${index}`}
      aria-labelledby={`study-report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StudyReport = ({ 
  title = 'Study Session Report',
  data = {},
  onClose,
  showDetails = true,
  onSaveIncorrect = null,
  onPracticeIncorrect = null
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);

  const { 
    score = 0, 
    totalQuestions = 0, 
    correctAnswers = 0,
    timeSpent = 0,
    category = 'All',
    answers = [] 
  } = data;

  // Calculate stats
  const incorrectAnswers = totalQuestions - correctAnswers;
  const avgTimePerQuestion = timeSpent > 0 ? Math.round(timeSpent / totalQuestions) : 0;
  const incorrectQuestionsData = answers.filter(a => !a.isCorrect);
  const topicDistribution = {};
  
  // Calculate performance by topic/category
  answers.forEach(answer => {
    const topic = answer.topic || answer.category || 'General';
    
    if (!topicDistribution[topic]) {
      topicDistribution[topic] = {
        total: 0,
        correct: 0,
        incorrect: 0
      };
    }
    
    topicDistribution[topic].total += 1;
    if (answer.isCorrect) {
      topicDistribution[topic].correct += 1;
    } else {
      topicDistribution[topic].incorrect += 1;
    }
  });

  // Sort topics by performance (worst first)
  const sortedTopics = Object.keys(topicDistribution).sort((a, b) => {
    const scoreA = (topicDistribution[a].correct / topicDistribution[a].total) * 100;
    const scoreB = (topicDistribution[b].correct / topicDistribution[b].total) * 100;
    return scoreA - scoreB;
  });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleBookmarkQuestion = (index) => {
    if (bookmarkedQuestions.includes(index)) {
      setBookmarkedQuestions(bookmarkedQuestions.filter(i => i !== index));
    } else {
      setBookmarkedQuestions([...bookmarkedQuestions, index]);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    return "error";
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={score}
                size={120}
                thickness={5}
                color={getPerformanceColor(score)}
              />
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
                <Typography variant="h4" component="div" color="text.secondary">
                  {score}%
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 1 }}>
            <Chip 
              icon={score >= 80 ? <CheckCircle /> : <Error />}
              label={score >= 80 ? "Passed" : "Needs Improvement"} 
              color={getPerformanceColor(score)}
              sx={{ fontWeight: 'bold' }} 
            />
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Visibility color="primary" />
              <Typography variant="body2" color="text.secondary">
                Questions
              </Typography>
              <Typography variant="h6">
                {totalQuestions}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CheckCircle color="success" />
              <Typography variant="body2" color="text.secondary">
                Correct
              </Typography>
              <Typography variant="h6">
                {correctAnswers}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <AccessTime color="info" />
              <Typography variant="body2" color="text.secondary">
                Time
              </Typography>
              <Typography variant="h6">
                {formatTime(timeSpent)}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Speed color="warning" />
              <Typography variant="body2" color="text.secondary">
                Avg Speed
              </Typography>
              <Typography variant="h6">
                {avgTimePerQuestion}s
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs for detailed information */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="study report tabs"
            >
              <Tab icon={<BarChart />} label="Performance" />
              <Tab icon={<Category />} label="Categories" />
              <Tab icon={<School />} label="Questions" />
              {incorrectQuestionsData.length > 0 && (
                <Tab icon={<Error />} label="Incorrect" />
              )}
            </Tabs>
          </Box>

          {/* Overall Performance Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Performance Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ flexGrow: 1, mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={score} 
                            color={getPerformanceColor(score)}
                            sx={{ height: 10, borderRadius: 5 }} 
                          />
                        </Box>
                        <Typography variant="body2">{score}%</Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Accuracy Rate
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ flexGrow: 1, mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(correctAnswers / totalQuestions) * 100} 
                            color="success"
                            sx={{ height: 10, borderRadius: 5 }} 
                          />
                        </Box>
                        <Typography variant="body2">{Math.round((correctAnswers / totalQuestions) * 100)}%</Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Completion Rate
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ flexGrow: 1, mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(answers.length / totalQuestions) * 100} 
                            color="info"
                            sx={{ height: 10, borderRadius: 5 }} 
                          />
                        </Box>
                        <Typography variant="body2">{Math.round((answers.length / totalQuestions) * 100)}%</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Statistics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Correct Answers" 
                        secondary={`${correctAnswers} of ${totalQuestions}`} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Cancel color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Incorrect Answers" 
                        secondary={`${incorrectAnswers} of ${totalQuestions}`} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total Time" 
                        secondary={`${formatTime(timeSpent)} (${avgTimePerQuestion}s per question)`} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Category color="secondary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Category" 
                        secondary={category} 
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Categories Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Performance by Category
            </Typography>
            
            {sortedTopics.length > 0 ? (
              <Box>
                {sortedTopics.map((topic, index) => {
                  const topicData = topicDistribution[topic];
                  const topicScore = Math.round((topicData.correct / topicData.total) * 100);
                  
                  return (
                    <Accordion key={index} sx={{ mb: 1 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`topic-${index}-content`}
                        id={`topic-${index}-header`}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                          <Typography variant="subtitle1">{topic}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              size="small" 
                              color={getPerformanceColor(topicScore)} 
                              label={`${topicScore}%`} 
                            />
                            {topicScore < 60 && <Error color="error" fontSize="small" />}
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <LinearProgress 
                              variant="determinate" 
                              value={topicScore} 
                              color={getPerformanceColor(topicScore)}
                              sx={{ height: 8, borderRadius: 4 }} 
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              Total Questions
                            </Typography>
                            <Typography variant="body1" align="center">
                              {topicData.total}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              Correct
                            </Typography>
                            <Typography variant="body1" color="success.main" align="center">
                              {topicData.correct}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              Incorrect
                            </Typography>
                            <Typography variant="body1" color="error.main" align="center">
                              {topicData.incorrect}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No category data available.
              </Typography>
            )}
          </TabPanel>

          {/* Questions Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Question Details
            </Typography>
            
            {answers.length > 0 ? (
              <List sx={{ mb: 2 }}>
                {answers.map((answer, index) => (
                  <Paper key={index} elevation={2} sx={{ mb: 2, borderLeft: 6, borderColor: answer.isCorrect ? 'success.main' : 'error.main' }}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: answer.isCorrect ? 'success.main' : 'error.main',
                            color: 'white',
                            width: 32,
                            height: 32,
                            fontSize: 16
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">
                              {answer.question}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleBookmarkQuestion(index)}
                              color="primary"
                            >
                              {bookmarkedQuestions.includes(index) ? <Bookmark /> : <BookmarkBorder />}
                            </IconButton>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography component="span" variant="body2" color="text.primary" display="block">
                              Your answer: <span style={{ color: answer.isCorrect ? '#2e7d32' : '#d32f2f', fontWeight: 500 }}>{answer.userAnswer}</span>
                            </Typography>
                            {!answer.isCorrect && (
                              <Typography component="span" variant="body2" color="success.main" display="block" sx={{ fontWeight: 500 }}>
                                Correct answer: {answer.correctAnswer}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No question data available.
              </Typography>
            )}
          </TabPanel>

          {/* Incorrect Tab */}
          {incorrectQuestionsData.length > 0 && (
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Incorrect Answers ({incorrectQuestionsData.length})
                </Typography>
                <Box>
                  {onPracticeIncorrect && (
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="small"
                      onClick={() => onPracticeIncorrect(incorrectQuestionsData)}
                      sx={{ mr: 1 }}
                    >
                      Practice These
                    </Button>
                  )}
                  
                  {onSaveIncorrect && (
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      size="small"
                      onClick={() => onSaveIncorrect(incorrectQuestionsData)}
                    >
                      Save for Later
                    </Button>
                  )}
                </Box>
              </Box>
              
              <List sx={{ mb: 2 }}>
                {incorrectQuestionsData.map((answer, index) => (
                  <Paper key={index} elevation={2} sx={{ mb: 2, borderLeft: 6, borderColor: 'error.main' }}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'error.main',
                            color: 'white',
                            width: 32,
                            height: 32,
                            fontSize: 16
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {answer.question}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography component="span" variant="body2" color="error.main" display="block">
                              Your answer: {answer.userAnswer}
                            </Typography>
                            <Typography component="span" variant="body2" color="success.main" display="block" sx={{ fontWeight: 500 }}>
                              Correct answer: {answer.correctAnswer}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </TabPanel>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
          >
            Close Report
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Define LinearProgress component since it's used multiple times
const LinearProgress = ({ value, color, ...props }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <CircularProgress
          variant="determinate"
          value={value}
          color={color}
          size={60}
          thickness={5}
          {...props}
        />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default StudyReport; 