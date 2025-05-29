/**
 * Utilities for working with questions and code snippets data
 */

import questionsData from '../data/questions.json';
import codeSnippetsData from '../data/codeSnippets.json';

// Types
interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  cloud: 'marketing' | 'sales' | 'service' | 'commerce' | 'cpq' | 'pardot';
  possibleAnswers: {
    text: string;
    score: number;
    isCorrect?: boolean;
  }[];
}

interface CodeSnippet {
  id: string;
  language: string;
  title: string;
  description: string;
  code: string;
  cloud: 'marketing' | 'sales' | 'service' | 'commerce' | 'cpq' | 'pardot';
  issues: {
    line: number;
    description: string;
    possibleFixes: {
      text: string;
      score: number;
      isCorrect?: boolean;
    }[];
  }[];
}

// Cloud availability data
interface CloudAvailability {
  questions: {
    total: number;
    byDifficulty: {
      easy: number;
      medium: number;
      hard: number;
      expert: number;
    };
  };
  codeSnippets: number;
  availableRoles: ('developer' | 'consultant')[];
  availableSeniorities: ('Junior' | 'Advanced' | 'Senior' | 'Specialist')[];
  maxQuestions: number;
  maxCodeSnippets: number;
}

/**
 * Get availability data for a specific cloud
 * @param cloud The cloud to get availability data for
 */
export const getCloudAvailability = (
  cloud: 'marketing' | 'sales' | 'service' | 'commerce' | 'cpq' | 'pardot'
): CloudAvailability => {
  // Filter questions by cloud
  const questions = (questionsData as Question[]).filter(
    (q) => q.cloud === cloud
  );

  // Count questions by difficulty
  const easyCount = questions.filter((q) => q.difficulty === 'easy').length;
  const mediumCount = questions.filter((q) => q.difficulty === 'medium').length;
  const hardCount = questions.filter((q) => q.difficulty === 'hard').length;
  const expertCount = questions.filter((q) => q.difficulty === 'expert').length;

  // Count code snippets by cloud
  const codeSnippets = (codeSnippetsData as CodeSnippet[]).filter(
    (cs) => cs.cloud === cloud
  ).length;

  // Determine available roles based on code snippets
  const availableRoles: ('developer' | 'consultant')[] = ['consultant'];
  if (codeSnippets > 0) {
    availableRoles.push('developer');
  }

  // Determine available seniorities based on difficulty levels
  const availableSeniorities: ('Junior' | 'Advanced' | 'Senior' | 'Specialist')[] = [];
  
  if (easyCount > 0) {
    availableSeniorities.push('Junior');
  }
  
  if (easyCount > 0 || mediumCount > 0) {
    availableSeniorities.push('Advanced');
  }
  
  if (mediumCount > 0 || hardCount > 0) {
    availableSeniorities.push('Senior');
  }
  
  if (hardCount > 0 || expertCount > 0) {
    availableSeniorities.push('Specialist');
  }

  // If no seniorities are available (edge case), default to Junior
  if (availableSeniorities.length === 0) {
    availableSeniorities.push('Junior');
  }

  // Calculate max questions and code snippets
  // For safety, we'll cap at 80% of available questions to allow for filtering
  const maxQuestions = Math.max(1, Math.floor(questions.length * 0.8));
  const maxCodeSnippets = Math.max(0, codeSnippets);

  return {
    questions: {
      total: questions.length,
      byDifficulty: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
        expert: expertCount,
      },
    },
    codeSnippets: codeSnippets,
    availableRoles,
    availableSeniorities,
    maxQuestions,
    maxCodeSnippets,
  };
};
