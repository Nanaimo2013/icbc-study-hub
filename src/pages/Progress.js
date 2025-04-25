import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Grid, 
  LinearProgress,
  Divider,
  Button,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Area,
  AreaChart
} from 'recharts';
import { 
  DeleteForever, 
  CloudDownload, 
  ExpandMore,
  CheckCircle,
  Error,
  Warning,
  Insights,
  BarChart as BarChartIcon,
  Category,
  School,
  Recommend
} from '@mui/icons-material';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
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

const Progress = ({ progress }) => {
  const [tabValue, setTabValue] = useState(0);
  const [timeFilter, setTimeFilter] = useState('all');
  
  const totalAnswered = progress.flashcards.total + progress.practice.total + progress.signs.total;
  const totalCorrect = progress.flashcards.correct + progress.practice.correct + progress.signs.correct;
  const correctPercentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  
  // Data for bar chart
  const barData = [
    { name: 'Flashcards', correct: progress.flashcards.correct, total: progress.flashcards.total, percentage: progress.flashcards.total > 0 ? Math.round((progress.flashcards.correct / progress.flashcards.total) * 100) : 0 },
    { name: 'Practice Tests', correct: progress.practice.correct, total: progress.practice.total, percentage: progress.practice.total > 0 ? Math.round((progress.practice.correct / progress.practice.total) * 100) : 0 },
    { name: 'Road Signs', correct: progress.signs.correct, total: progress.signs.total, percentage: progress.signs.total > 0 ? Math.round((progress.signs.correct / progress.signs.total) * 100) : 0 }
  ];
  
  // Data for pie chart
  const pieData = [
    { name: 'Correct', value: totalCorrect, color: '#4caf50' },
    { name: 'Incorrect', value: totalAnswered - totalCorrect, color: '#f44336' }
  ];
  
  // Mock data for radar chart (skill breakdown)
  const radarData = [
    { subject: 'Rules', A: 85, fullMark: 100 },
    { subject: 'Signs', A: progress.signs.total > 0 ? Math.round((progress.signs.correct / progress.signs.total) * 100) : 0, fullMark: 100 },
    { subject: 'Hazards', A: 72, fullMark: 100 },
    { subject: 'Parking', A: 68, fullMark: 100 },
    { subject: 'Speed Limits', A: 90, fullMark: 100 },
    { subject: 'Signals', A: 75, fullMark: 100 },
  ];
  
  // Mock data for line chart (progress over time)
  const lineData = [
    { name: 'Week 1', score: 65 },
    { name: 'Week 2', score: 68 },
    { name: 'Week 3', score: 72 },
    { name: 'Week 4', score: 78 },
    { name: 'Week 5', score: 82 },
    { name: 'Week 6', score: correctPercentage }
  ];
  
  // Category performance data
  const categoryData = [
    { name: 'Rules', correct: 45, total: 55, percentage: 82 },
    { name: 'Signs', correct: progress.signs.correct, total: progress.signs.total, percentage: progress.signs.total > 0 ? Math.round((progress.signs.correct / progress.signs.total) * 100) : 0 },
    { name: 'Hazards', correct: 32, total: 45, percentage: 71 },
    { name: 'Parking', correct: 20, total: 30, percentage: 67 },
    { name: 'Speed Limits', correct: 18, total: 20, percentage: 90 },
    { name: 'Signals', correct: 22, total: 30, percentage: 73 }
  ];
  
  // Areas for improvement data (categories with lowest scores)
  const improvementAreas = [...categoryData].sort((a, b) => a.percentage - b.percentage).slice(0, 3);
  
  // Weekly study time data
  const studyTimeData = [
    { day: 'Monday', minutes: 45 },
    { day: 'Tuesday', minutes: 30 },
    { day: 'Wednesday', minutes: 60 },
    { day: 'Thursday', minutes: 20 },
    { day: 'Friday', minutes: 0 },
    { day: 'Saturday', minutes: 75 },
    { day: 'Sunday', minutes: 50 }
  ];
  
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress data? This cannot be undone.')) {
      localStorage.removeItem('icbcStudyProgress');
      window.location.reload();
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
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Learning Progress
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body1" color="text.secondary">
            Track your performance across different study modules and identify areas for improvement.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="time-filter-label">Time Period</InputLabel>
              <Select
                labelId="time-filter-label"
                id="time-filter"
                value={timeFilter}
                label="Time Period"
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="90days">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              startIcon={<DeleteForever />}
              onClick={handleResetProgress}
            >
              Reset Progress
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* Overall Progress Summary */}
      <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">Overall Progress Summary</Typography>
        </Box>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <Typography variant="h3" color="primary" align="center">
                    {correctPercentage}%
                  </Typography>
                  <Chip 
                    icon={correctPercentage >= 80 ? <CheckCircle /> : correctPercentage >= 60 ? <Warning /> : <Error />}
                    label={correctPercentage >= 80 ? "Excellent" : correctPercentage >= 60 ? "Good" : "Needs Improvement"} 
                    color={getPerformanceColor(correctPercentage)}
                    sx={{ ml: 2 }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" align="center">
                  Overall Accuracy
                </Typography>
              </Box>
              
              <Box sx={{ px: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={correctPercentage} 
                  color={getPerformanceColor(correctPercentage)}
                  sx={{ height: 20, borderRadius: 1 }} 
                />
                
                <Typography sx={{ mt: 1 }} variant="body2" align="center">
                  {totalCorrect} correct out of {totalAnswered} questions attempted
                </Typography>
              </Box>
              
              <Box sx={{ mt: 3, px: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Quick Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper elevation={1} sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">{totalAnswered}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Questions</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper elevation={1} sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6" color="success.main">{totalCorrect}</Typography>
                      <Typography variant="caption" color="text.secondary">Correct</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper elevation={1} sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6" color="error.main">{totalAnswered - totalCorrect}</Typography>
                      <Typography variant="caption" color="text.secondary">Incorrect</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} questions`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Tab navigation for detailed views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="progress tabs"
        >
          <Tab icon={<BarChartIcon />} label="Module Performance" />
          <Tab icon={<Category />} label="Categories" />
          <Tab icon={<Insights />} label="Analysis" />
          <Tab icon={<Recommend />} label="Recommendations" />
        </Tabs>
      </Box>
      
      {/* Module Performance Tab */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom>
          Module Performance
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {barData.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                </Box>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h4" color={getPerformanceColor(item.percentage) + '.main'}>
                      {item.percentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accuracy Rate
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={item.percentage} 
                    color={getPerformanceColor(item.percentage)}
                    sx={{ height: 8, borderRadius: 1, mb: 2 }} 
                  />
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Questions</Typography>
                      <Typography variant="body1" fontWeight="medium">{item.total}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Correct</Typography>
                      <Typography variant="body1" fontWeight="medium">{item.correct}</Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.total === 0 ? 'No activity yet' : item.percentage >= 80 ? 'Excellent work!' : item.percentage >= 60 ? 'Good progress, keep practicing' : 'Needs improvement'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Card elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="subtitle1">Performance Comparison</Typography>
          </Box>
          <CardContent>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, '']} />
                  <Legend />
                  <Bar dataKey="correct" name="Correct Answers" stackId="a" fill="#4caf50" />
                  <Bar dataKey="total" name="Total Questions" stackId="a" fill="#bbdefb" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>
      
      {/* Categories Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>
          Performance by Category
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                <Typography variant="subtitle1">Category Breakdown</Typography>
              </Box>
              <CardContent>
                {categoryData.map((category, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">
                        {category.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                          {category.percentage}%
                        </Typography>
                        <Chip 
                          size="small" 
                          color={getPerformanceColor(category.percentage)} 
                          label={category.percentage >= 80 ? "Strong" : category.percentage >= 60 ? "Average" : "Weak"} 
                        />
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={category.percentage} 
                      color={getPerformanceColor(category.percentage)}
                      sx={{ height: 8, borderRadius: 1 }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      {category.correct} of {category.total} correct
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <Card elevation={2} sx={{ mb: 3, height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                <Typography variant="subtitle1">Skill Radar</Typography>
              </Box>
              <CardContent>
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Analysis Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom>
          Progress Analysis
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="subtitle1">Progress Over Time</Typography>
              </Box>
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                <Typography variant="subtitle1">Study Time Distribution</Typography>
              </Box>
              <CardContent>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={studyTimeData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} minutes`, 'Study Time']} />
                      <Area type="monotone" dataKey="minutes" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                <Typography variant="subtitle1">Weakest Categories</Typography>
              </Box>
              <CardContent>
                <List>
                  {improvementAreas.map((area, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Error color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={area.name} 
                        secondary={`${area.percentage}% accuracy (${area.correct}/${area.total})`} 
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<School />}
                  >
                    Focus on Weak Areas
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Recommendations Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h5" gutterBottom>
          Personalized Recommendations
        </Typography>
        
        <Card elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="subtitle1">Study Recommendations</Typography>
          </Box>
          <CardContent>
            <Typography variant="body1" paragraph>
              Based on your performance, here are some personalized recommendations to help you improve:
            </Typography>
            
            <Accordion elevation={1} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" color="primary">Focus on Weak Categories</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Your weakest categories are:
                </Typography>
                <List dense>
                  {improvementAreas.map((area, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={area.name} 
                        secondary={`${area.percentage}% accuracy - We recommend spending at least 20 minutes focusing on this category`} 
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" color="primary">
                    Start Targeted Practice
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion elevation={1} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" color="primary">Recommended Study Schedule</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  For optimal learning, we recommend the following study schedule:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Daily Flashcards: 10-15 minutes" 
                      secondary="Focus on consistent, spaced repetition to improve memory retention" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Practice Tests: 2-3 times per week" 
                      secondary="Complete full practice tests to simulate the real exam environment" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Focused Category Study: 20 minutes, 3 times per week" 
                      secondary="Target your weak areas to efficiently improve your overall score" 
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion elevation={1}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" color="primary">Test Readiness Assessment</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h5" color={correctPercentage >= 80 ? "success.main" : "warning.main"}>
                    {correctPercentage >= 80 ? "You're Ready!" : "Almost There"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {correctPercentage >= 80 
                      ? "Based on your current scores, you're likely to pass the ICBC knowledge test." 
                      : "Continue practicing to improve your chances of passing the ICBC knowledge test."}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={correctPercentage} 
                    color={getPerformanceColor(correctPercentage)}
                    sx={{ height: 10, borderRadius: 1, mb: 1 }} 
                  />
                  <Typography variant="caption">
                    Test Readiness: {correctPercentage}%
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" paragraph>
                  Our recommendation:
                </Typography>
                <Typography variant="body1" fontWeight="medium" paragraph>
                  {correctPercentage >= 80 
                    ? "Schedule your ICBC knowledge test - you're ready!" 
                    : "Complete at least 5 more practice tests before scheduling your ICBC knowledge test."}
                </Typography>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color={correctPercentage >= 80 ? "success" : "primary"}
                  >
                    {correctPercentage >= 80 ? "Schedule Test" : "Continue Practicing"}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<CloudDownload />}
          >
            Download Progress Report
          </Button>
        </Box>
      </TabPanel>
    </Container>
  );
};

export default Progress; 