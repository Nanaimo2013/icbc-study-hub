import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

/**
 * Loads and parses a YAML file
 * @param {string} filePath - Path to the YAML file, relative to the project root
 * @returns {Object} The parsed YAML content
 */
export function loadYamlFile(filePath) {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const data = yaml.load(fileContents);
    return data;
  } catch (error) {
    console.error(`Error loading YAML file ${filePath}:`, error);
    return null;
  }
}

/**
 * Gets all questions from the YAML file
 * @returns {Array} Array of question objects
 */
export function getQuestions() {
  const data = loadYamlFile('src/data/questions.yaml');
  return data?.questions || [];
}

/**
 * Gets questions filtered by category
 * @param {string} category - Category to filter by
 * @returns {Array} Array of filtered question objects
 */
export function getQuestionsByCategory(category) {
  const questions = getQuestions();
  return questions.filter(q => q.category === category);
}

/**
 * Gets questions filtered by difficulty
 * @param {string} difficulty - Difficulty level to filter by
 * @returns {Array} Array of filtered question objects
 */
export function getQuestionsByDifficulty(difficulty) {
  const questions = getQuestions();
  return questions.filter(q => q.difficulty === difficulty);
}

/**
 * Gets a question by ID
 * @param {number} id - Question ID
 * @returns {Object|null} The question object or null if not found
 */
export function getQuestionById(id) {
  const questions = getQuestions();
  return questions.find(q => q.id === id) || null;
} 