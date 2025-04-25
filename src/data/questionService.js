import yaml from 'js-yaml';
import questionsData from './questions.js';
import questionsYaml from './questions.yaml';

// Default data structure in case loading fails
const defaultData = {
  categories: [
    { id: "signs", name: "Road Signs", description: "Learn about traffic signs and their meanings", icon: "signs" },
    { id: "rules", name: "Road Rules", description: "Understanding driving regulations and laws", icon: "rules" },
    { id: "hazards", name: "Hazard Awareness", description: "Identifying and responding to road hazards", icon: "hazards" },
    { id: "safety", name: "Road Safety", description: "Safety practices for drivers and pedestrians", icon: "safety" },
    { id: "parking", name: "Parking Rules", description: "Rules and regulations for parking", icon: "parking" }
  ],
  questions: []
};

class QuestionService {
  constructor() {
    this.data = {
      categories: defaultData.categories,
      questions: []
    };
    this.userData = {
      progress: {},
      bookmarked: [],
      incorrectQuestions: [],
      studyHistory: [],
      settings: {
        theme: 'light',
        notifications: true,
        studyReminders: false
      }
    };
    this.notifications = [];
    this.initialize();
  }

  // Initialize the service and load data
  initialize() {
    try {
      // First try to use the JS data
      if (questionsData && questionsData.questions && questionsData.questions.length > 0) {
        console.log('Using questions from questions.js');
        this.data = questionsData;
      } 
      // Then try to load from YAML as a backup
      else if (questionsYaml) {
        console.log('Attempting to use YAML data');
        try {
          // If questionsYaml is already an object
          if (typeof questionsYaml === 'object' && questionsYaml.questions) {
            this.data = questionsYaml;
          } 
          // Otherwise try to parse it
          else {
            this.data = yaml.load(questionsYaml);
          }
          
          // Additional validation for the YAML data
          if (this.data && this.data.questions) {
            // Check each question for required fields
            this.data.questions = this.data.questions.filter(q => {
              return q && q.id && q.question && q.answer && q.category;
            });
            console.log(`Valid questions after filtering: ${this.data.questions.length}`);
          }
        } catch (yamlError) {
          console.error('Failed to parse YAML:', yamlError);
          this.useDefaultData();
          return;
        }
      } else {
        console.error('No question data sources available');
        this.useDefaultData();
        return;
      }
      
      // Validate the data
      if (!this.data || !this.data.questions || this.data.questions.length === 0) {
        console.error('No valid questions found in any data source');
        this.useDefaultData();
        return;
      }
      
      console.log(`Questions loaded successfully: ${this.data.questions.length} questions found`);
    } catch (error) {
      console.error('Error loading questions:', error);
      this.useDefaultData();
    }

    // Load user data from localStorage
    this.loadUserData();

    // Add IDs to questions if they don't have them
    this.ensureQuestionIds();
  }
  
  // Use default data when loading fails
  useDefaultData() {
    console.log('Using fallback question data from questions.js');
    this.data = questionsData;
  }

  // Make sure all questions have unique IDs
  ensureQuestionIds() {
    if (!this.data || !this.data.questions) return;

    this.data.questions.forEach((question, index) => {
      if (!question.id) {
        question.id = `q${index + 1}`;
      }
    });
  }

  // Get all categories
  getCategories() {
    return this.data?.categories || defaultData.categories;
  }

  // Get all questions
  getAllQuestions() {
    return this.data?.questions || [];
  }

  // Get questions by category
  getQuestionsByCategory(categoryId) {
    if (!categoryId || categoryId === 'all') {
      return this.getAllQuestions();
    }
    return this.getAllQuestions().filter(q => q.category === categoryId);
  }

  // Get questions by difficulty
  getQuestionsByDifficulty(difficulty) {
    if (!difficulty || difficulty === 'all') {
      return this.getAllQuestions();
    }
    return this.getAllQuestions().filter(q => q.difficulty === difficulty);
  }

  // Get questions by both category and difficulty
  getFilteredQuestions({ category, difficulty }) {
    let questions = this.getAllQuestions();
    
    if (category && category !== 'all') {
      questions = questions.filter(q => q.category === category);
    }
    
    if (difficulty && difficulty !== 'all') {
      questions = questions.filter(q => q.difficulty === difficulty);
    }
    
    return questions;
  }

  // Get a random subset of questions
  getRandomQuestions(count = 20, filters = {}) {
    const filteredQuestions = this.getFilteredQuestions(filters);
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // Get a question by ID
  getQuestionById(id) {
    return this.getAllQuestions().find(q => q.id === id);
  }

  // Get user progress data
  getUserProgress() {
    return this.userData.progress;
  }

  // Get the overall progress percentage
  getOverallProgress() {
    const progress = this.userData.progress;
    let totalCorrect = 0;
    let totalAnswered = 0;
    
    Object.values(progress).forEach(moduleProgress => {
      totalCorrect += moduleProgress.correct || 0;
      totalAnswered += moduleProgress.total || 0;
    });
    
    if (totalAnswered === 0) return 0;
    return Math.round((totalCorrect / totalAnswered) * 100);
  }

  // Update progress for a specific module
  updateProgress(module, total, correct) {
    if (!this.userData.progress[module]) {
      this.userData.progress[module] = { total: 0, correct: 0, sessions: 0 };
    }
    
    this.userData.progress[module].total = (this.userData.progress[module].total || 0) + total;
    this.userData.progress[module].correct = (this.userData.progress[module].correct || 0) + correct;
    this.userData.progress[module].sessions = (this.userData.progress[module].sessions || 0) + 1;
    this.userData.progress[module].lastUpdated = new Date().toISOString();
    
    // Also track by category if available
    if (module === 'practice' || module === 'flashcards') {
      if (!this.userData.progress.categories) {
        this.userData.progress.categories = {};
      }
      
      const categories = this.getCategories();
      categories.forEach(category => {
        const categoryId = category.id;
        if (!this.userData.progress.categories[categoryId]) {
          this.userData.progress.categories[categoryId] = { total: 0, correct: 0 };
        }
        
        // Simplified approach - distribute progress across categories evenly
        // In a real app, you would track which questions from each category were answered
        const share = 1 / categories.length;
        this.userData.progress.categories[categoryId].total += Math.round(total * share);
        this.userData.progress.categories[categoryId].correct += Math.round(correct * share);
      });
    }
    
    this.saveUserData();
    return this.userData.progress;
  }

  // Add a session to study history
  addStudySession(sessionData) {
    this.userData.studyHistory.push({
      ...sessionData,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the last 50 study sessions to prevent the data from growing too large
    if (this.userData.studyHistory.length > 50) {
      this.userData.studyHistory = this.userData.studyHistory.slice(-50);
    }
    
    this.saveUserData();
  }

  // Get bookmarked questions
  getBookmarkedQuestions() {
    const bookmarkedIds = this.userData.bookmarked;
    return this.getAllQuestions().filter(q => bookmarkedIds.includes(q.id));
  }

  // Toggle bookmark status for a question
  toggleBookmark(questionId) {
    const index = this.userData.bookmarked.indexOf(questionId);
    if (index === -1) {
      this.userData.bookmarked.push(questionId);
      this.addNotification('Question bookmarked successfully!', 'success');
    } else {
      this.userData.bookmarked.splice(index, 1);
      this.addNotification('Question removed from bookmarks', 'info');
    }
    this.saveUserData();
    return this.userData.bookmarked.includes(questionId);
  }

  // Get incorrect questions for practice
  getIncorrectQuestions() {
    const incorrectIds = this.userData.incorrectQuestions;
    return this.getAllQuestions().filter(q => incorrectIds.includes(q.id));
  }

  // Save incorrect questions for later practice
  saveIncorrectQuestions(questions) {
    // Extract question IDs if full objects are provided
    const questionIds = questions.map(q => typeof q === 'string' ? q : q.id);
    
    // Add only unique IDs that don't already exist in the list
    questionIds.forEach(id => {
      if (id && !this.userData.incorrectQuestions.includes(id)) {
        this.userData.incorrectQuestions.push(id);
      }
    });
    
    this.saveUserData();
    this.addNotification(`${questionIds.length} questions saved for practice`, 'success');
    return this.userData.incorrectQuestions;
  }

  // Remove questions from incorrect list (e.g., after mastering them)
  removeFromIncorrectQuestions(questionIds) {
    if (!Array.isArray(questionIds)) {
      questionIds = [questionIds];
    }
    
    this.userData.incorrectQuestions = this.userData.incorrectQuestions.filter(
      id => !questionIds.includes(id)
    );
    
    this.saveUserData();
    this.addNotification('Questions removed from practice list', 'info');
  }

  // Reset all user progress
  resetProgress() {
    this.userData.progress = {};
    this.saveUserData();
    this.addNotification('Progress has been reset', 'info');
  }

  // Update user settings
  updateSettings(newSettings) {
    this.userData.settings = {
      ...this.userData.settings,
      ...newSettings
    };
    this.saveUserData();
    this.addNotification('Settings updated', 'success');
  }

  // Get user settings
  getSettings() {
    return this.userData.settings;
  }

  // Add a notification to the queue
  addNotification(message, type = 'info', duration = 3000) {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      duration
    };
    
    this.notifications.push(notification);
    
    // Keep only the last 10 notifications
    if (this.notifications.length > 10) {
      this.notifications.shift();
    }
    
    return notification;
  }

  // Get all notifications
  getNotifications() {
    return this.notifications;
  }

  // Clear all notifications
  clearNotifications() {
    this.notifications = [];
  }

  // Save user data to localStorage
  saveUserData() {
    try {
      localStorage.setItem('icbc_study_user_data', JSON.stringify(this.userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      this.addNotification('Failed to save your progress', 'error');
    }
  }

  // Load user data from localStorage
  loadUserData() {
    try {
      const userData = localStorage.getItem('icbc_study_user_data');
      if (userData) {
        this.userData = JSON.parse(userData);
        
        // Ensure all required properties exist
        if (!this.userData.progress) this.userData.progress = {};
        if (!this.userData.bookmarked) this.userData.bookmarked = [];
        if (!this.userData.incorrectQuestions) this.userData.incorrectQuestions = [];
        if (!this.userData.studyHistory) this.userData.studyHistory = [];
        if (!this.userData.settings) {
          this.userData.settings = {
            theme: 'light',
            notifications: true,
            studyReminders: false
          };
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.addNotification('Could not load your previous study data', 'error');
      this.userData = {
        progress: {},
        bookmarked: [],
        incorrectQuestions: [],
        studyHistory: [],
        settings: {
          theme: 'light',
          notifications: true,
          studyReminders: false
        }
      };
    }
  }

  // Export user data (for backup)
  exportUserData() {
    return JSON.stringify(this.userData);
  }

  // Import user data (from backup)
  importUserData(jsonData) {
    try {
      const parsedData = JSON.parse(jsonData);
      this.userData = parsedData;
      this.saveUserData();
      this.addNotification('User data imported successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      this.addNotification('Failed to import user data', 'error');
      return false;
    }
  }
}

// Create singleton instance
const questionService = new QuestionService();

export default questionService; 