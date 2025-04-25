import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  LinearProgress,
  Container,
  Paper,
  Avatar,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { 
  School as SchoolIcon, 
  Quiz as QuizIcon, 
  Image as ImageIcon, 
  BarChart as BarChartIcon,
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import questionService from '../data/questionService';

const FeatureCard = ({ title, description, icon, buttonText, path, navigate }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.4s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-12px)',
          boxShadow: 8
        }
      }} 
      elevation={3}
    >
      <Box 
        sx={{ 
          background: 'linear-gradient(45deg, #00bcd4 30%, #0077aa 90%)',
          p: 2,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'white',
            color: 'primary.main',
            transform: 'translateY(25%)',
            border: '4px solid',
            borderColor: 'background.paper',
            boxShadow: 3
          }}
        >
          {icon}
        </Avatar>
      </Box>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4, px: 3, mt: 2 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(path)}
          sx={{ 
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 5
            }
          }}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};

const ProgressCard = ({ title, value, total, color, icon }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4
        }
      }}
    >
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          bgcolor: color
        }}
      />
      <CardContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: `${color}22`, 
              color: color,
              mr: 2
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6">{title}</Typography>
        </Box>
        
        <Box sx={{ position: 'relative', pt: 1, pb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              mb: 1,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                bgcolor: color,
                borderRadius: 5
              }
            }} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">{value} correct</Typography>
            <Typography variant="body2" fontWeight="bold">{percentage}%</Typography>
          </Box>
        </Box>
        
        <Chip 
          label={`${total} total questions`} 
          size="small" 
          sx={{ bgcolor: 'background.paper' }}
        />
      </CardContent>
    </Card>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{ 
        height: '100%',
        borderRadius: 3,
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ bgcolor: `${color}22`, color: color, mr: 2 }}>{icon}</Avatar>
          <Typography variant="h6" component="div" fontWeight="medium">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? color : 'text.primary', pl: 1, mt: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Home = ({ progress }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0);
  const [studyStats, setStudyStats] = useState({
    sessionsCompleted: 0,
    timeSpent: 0
  });

  // Load categories and total questions count
  useEffect(() => {
    const allCategories = questionService.getCategories();
    setCategories(allCategories);
    setTotalQuestionsCount(questionService.getAllQuestions().length);
    
    // Calculate study stats
    const userData = JSON.parse(localStorage.getItem('icbc_study_user_data') || '{}');
    const history = userData.studyHistory || [];
    const sessions = history.length;
    
    // Estimate time spent (in minutes) based on questions answered
    // Assuming each question takes ~30 seconds on average
    const totalQuestionsAnswered = progress.flashcards.total + progress.practice.total + progress.signs.total;
    const estimatedTimeInMinutes = Math.round(totalQuestionsAnswered * 0.5);
    
    setStudyStats({
      sessionsCompleted: sessions,
      timeSpent: estimatedTimeInMinutes
    });
  }, [progress]);

  // Calculate total progress
  const totalAnswered = progress.flashcards.total + progress.practice.total + progress.signs.total;
  const totalCorrect = progress.flashcards.correct + progress.practice.correct + progress.signs.correct;
  const progressPercentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const features = [
    {
      title: 'Flashcards',
      description: 'Study road signs and rules with interactive flashcards. Perfect for quick reviews and memorization.',
      icon: <SchoolIcon fontSize="large" />,
      buttonText: 'Start Flashcards',
      path: '/flashcards'
    },
    {
      title: 'Practice Test',
      description: 'Take randomized tests to prepare for the ICBC knowledge exam. Simulate real test conditions.',
      icon: <QuizIcon fontSize="large" />,
      buttonText: 'Start Practice',
      path: '/practice'
    },
    {
      title: 'Road Signs',
      description: 'Learn about various road signs and their meanings. Visual aids help reinforce your understanding.',
      icon: <ImageIcon fontSize="large" />,
      buttonText: 'View Signs',
      path: '/signs'
    },
    {
      title: 'Your Progress',
      description: 'Track your progress and see how well you are doing. Review your performance and identify areas for improvement.',
      icon: <BarChartIcon fontSize="large" />,
      buttonText: 'View Progress',
      path: '/progress'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      <Box 
        sx={{ 
          mb: 6, 
          textAlign: 'center',
          px: { xs: 2, md: 6 },
          animation: 'slideDown 0.8s ease-out'
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          fontWeight="bold"
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(45deg, #00bcd4 30%, #0077aa 90%)' 
              : 'linear-gradient(45deg, #00bcd4 30%, #0077aa 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          ICBC Study Hub
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            maxWidth: 800, 
            mx: 'auto',
            mb: 4,
            lineHeight: 1.6 
          }}
        >
          Master your driving knowledge and ace the ICBC test with our interactive study tools. Track your progress and practice at your own pace.
        </Typography>

        {totalAnswered > 0 && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 3,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              animation: 'pulse 2s infinite'
            }}
          >
            <TrophyIcon />
            <Typography variant="body1">
              You've answered <strong>{totalAnswered}</strong> questions with <strong>{progressPercentage}%</strong> accuracy!
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Questions" 
            value={totalQuestionsCount} 
            icon={<QuizIcon />} 
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Categories" 
            value={categories.length} 
            icon={<CategoryIcon />} 
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Study Time" 
            value={`${studyStats.timeSpent} mins`} 
            icon={<TimerIcon />} 
            color="#ff9800"
          />
        </Grid>
      </Grid>

      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        align="center" 
        sx={{ 
          mb: 4,
          fontWeight: 'bold',
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '60px',
            height: '4px',
            backgroundColor: 'primary.main',
            margin: '16px auto'
          }
        }}
      >
        Study Tools
      </Typography>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <FeatureCard {...feature} navigate={navigate} />
          </Grid>
        ))}
      </Grid>

      <Box 
        sx={{ 
          mb: 6, 
          p: 4, 
          borderRadius: 4,
          bgcolor: 'background.paper',
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          align="center"
          fontWeight="bold" 
          sx={{ mb: 4 }}
        >
          Your Learning Progress
        </Typography>
        
        <Box sx={{ mt: 3, mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            sx={{ 
              height: 24, 
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }
            }} 
          />
        </Box>
        
        <Typography 
          variant="h6" 
          align="center" 
          sx={{ mb: 4 }}
        >
          <span style={{ fontWeight: 'bold' }}>{progressPercentage}% correct</span> ({totalCorrect} of {totalAnswered} questions)
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <ProgressCard 
              title="Flashcards" 
              value={progress.flashcards.correct} 
              total={progress.flashcards.total} 
              color="#4caf50"
              icon={<SchoolIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <ProgressCard 
              title="Practice Tests" 
              value={progress.practice.correct} 
              total={progress.practice.total} 
              color="#2196f3"
              icon={<QuizIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <ProgressCard 
              title="Road Signs" 
              value={progress.signs.correct} 
              total={progress.signs.total} 
              color="#f44336"
              icon={<ImageIcon />}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Key Features
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {[
            { title: 'Interactive Flashcards', desc: 'Quick learning with engaging flashcards' },
            { title: 'Randomized Practice Tests', desc: 'Simulate real exam conditions' },
            { title: 'Visual Sign Study', desc: 'Learn with images and descriptions' },
            { title: 'Progress Tracking', desc: 'Monitor your learning journey' },
            { title: 'Dark & Light Modes', desc: 'Comfortable reading in any conditions' },
            { title: 'Responsive Design', desc: 'Access from any device' },
            { title: 'Local Storage Saving', desc: 'Your progress is automatically saved' },
            { title: 'Regular Updates', desc: 'Stay current with new questions' }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  p: 2,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 4,
          p: 4,
          borderRadius: 4,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(45deg, rgba(0,0,0,0.6) 0%, rgba(0,30,60,0.6) 100%)' 
            : 'linear-gradient(45deg, rgba(0,188,212,0.05) 0%, rgba(0,119,170,0.1) 100%)',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Ready to start learning?
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => navigate('/flashcards')}
          sx={{ 
            mt: 2, 
            px: 4, 
            py: 1.5, 
            borderRadius: 3,
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 5
            }
          }}
        >
          Get Started
        </Button>
      </Box>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Container>
  );
};

export default Home;