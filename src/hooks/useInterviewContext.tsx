import { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  cloud: 'marketing' | 'sales' | 'service' | 'commerce' | 'cpq' | 'pardot'; // Cloud property
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
  cloud: 'marketing' | 'sales' | 'service' | 'commerce' | 'cpq' | 'pardot'; // Cloud property
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

interface InterviewSettings {
  candidateName: string;
  role: 'developer' | 'consultant';
  seniority: 'Junior' | 'Advanced' | 'Senior' | 'Specialist'; // New seniority levels
  questionCount: number;
  codeSnippetCount: number;
  selectedCategories: string[];
  timeLimit: number; // in minutes
  cloud: 'marketing' | 'sales' | 'service' | 'commerce' | 'cpq' | 'pardot'; // Different cloud options
}

interface InterviewResults {
  totalScore: number;
  questionScores: { questionId: string; score: number }[];
  codeScores: { snippetId: string; score: number }[];
  timeSpent: number; // in seconds
}

interface InterviewContextType {
  settings: InterviewSettings;
  updateSettings: (newSettings: Partial<InterviewSettings>) => void;
  currentQuestion: Question | null;
  currentCodeSnippet: CodeSnippet | null;
  answers: Record<string, number>;
  codeAnswers: Record<string, { issueId: number; fixId: number }[]>;
  results: InterviewResults;
  startInterview: () => void;
  answerQuestion: (questionId: string, answerIndex: number) => void;
  answerCodeIssue: (snippetId: string, issueIndex: number, fixIndex: number) => void;
  nextQuestion: () => void;
  nextCodeSnippet: () => void;
  finishInterview: () => void;
  resetInterview: () => void; // New function to reset the interview
  interviewInProgress: boolean;
  questionIndex: number;
  codeSnippetIndex: number;
  timeRemaining: number;
}

const defaultSettings: InterviewSettings = {
  candidateName: '',
  role: 'developer', // Default role
  seniority: 'Junior', // Default seniority
  questionCount: 5,
  codeSnippetCount: 3,
  selectedCategories: ['ampscript', 'ssjs', 'marketing_cloud'],
  timeLimit: 30, // 30 minutes by default
  cloud: 'marketing', // Default cloud is marketing cloud
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<InterviewSettings>(defaultSettings);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [codeSnippetIndex, setCodeSnippetIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [codeAnswers, setCodeAnswers] = useState<Record<string, { issueId: number; fixId: number }[]>>({});
  const [results, setResults] = useState<InterviewResults>({
    totalScore: 0,
    questionScores: [],
    codeScores: [],
    timeSpent: 0,
  });
  const [interviewInProgress, setInterviewInProgress] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Fetch questions and code snippets (simulated)
  const fetchQuestionsAndCodeSnippets = () => {
    // In a real app, this would fetch from an API or data source
    import('@data/questions.json').then((data) => {
      // Filter based on settings
      let filteredQuestions = data.default as Question[];
      
      // Filter by cloud first
      filteredQuestions = filteredQuestions.filter(q => q.cloud === settings.cloud);
      
      // Then filter by categories based on role
      if (settings.selectedCategories.length > 0) {
        // Keep track of original filtered by cloud
        const cloudFilteredQuestions = [...filteredQuestions];
        
        filteredQuestions = filteredQuestions.filter(q => 
          settings.selectedCategories.includes(q.category)
        );
        
        // If no questions match the categories, fall back to using all questions for the cloud
        if (filteredQuestions.length === 0) {
          console.log(`Warning: No questions match the selected categories. Using all questions for ${settings.cloud} cloud.`);
          filteredQuestions = cloudFilteredQuestions;
        }
      }
      
      // Filter by difficulty based on seniority
      const allowedDifficulties: Record<string, string[]> = {
        'Junior': ['easy'],
        'Advanced': ['easy', 'medium'],
        'Senior': ['medium', 'hard'],
        'Specialist': ['hard', 'expert']
      };
      
      // Safety check: ensure seniority is a valid value
      const seniority = settings.seniority || 'Junior';
      const validSeniority = ['Junior', 'Advanced', 'Senior', 'Specialist'].includes(seniority) 
        ? seniority 
        : 'Junior';
      
      // Keep track of pre-difficulty filtered questions
      const preFilteredByDifficulty = [...filteredQuestions];
      
      filteredQuestions = filteredQuestions.filter(q => 
        allowedDifficulties[validSeniority].includes(q.difficulty)
      );
      
      // If filtering by difficulty leaves us with no questions, fall back to all questions for this cloud
      if (filteredQuestions.length === 0) {
        console.log(`Warning: No questions match the selected difficulty level. Using all questions for ${settings.cloud} cloud.`);
        filteredQuestions = preFilteredByDifficulty;
      }
      
      // Shuffle and limit based on questionCount
      let shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
      
      // If we don't have enough questions after filtering, adjust the question count
      if (shuffled.length < settings.questionCount) {
        console.log(`Warning: Only ${shuffled.length} questions match the current filters. Using available questions instead of the requested ${settings.questionCount}.`);
      }
      
      // Ensure we only take the available count or the requested count, whichever is smaller
      setQuestions(shuffled.slice(0, Math.min(shuffled.length, settings.questionCount)));
    });
    
    import('@data/codeSnippets.json').then((data) => {
      let filteredSnippets = data.default as CodeSnippet[];
      
      // Filter by cloud first
      filteredSnippets = filteredSnippets.filter(snippet => snippet.cloud === settings.cloud);
      
      // If no code snippets for this cloud, just return an empty array
      if (filteredSnippets.length === 0) {
        console.log(`Warning: No code snippets available for ${settings.cloud} cloud.`);
        setCodeSnippets([]);
        return;
      }
      
      // Filter by difficulty based on seniority
      const allowedDifficulties: Record<string, string[]> = {
        'Junior': ['easy'],
        'Advanced': ['easy', 'medium'],
        'Senior': ['medium', 'hard'],
        'Specialist': ['hard', 'expert']
      };
      
      // Safety check: ensure seniority is a valid value
      const seniority = settings.seniority || 'Junior';
      const validSeniority = ['Junior', 'Advanced', 'Senior', 'Specialist'].includes(seniority) 
        ? seniority 
        : 'Junior';
      
      // Keep track of pre-difficulty filtered snippets
      const preFilteredByDifficulty = [...filteredSnippets];
      
      // Assuming code snippets also have a difficulty property
      filteredSnippets = filteredSnippets.filter(snippet => {
        // If snippet has a difficulty property, filter by that
        if ('difficulty' in snippet) {
          return allowedDifficulties[validSeniority].includes((snippet as any).difficulty);
        }
        // Otherwise include all snippets
        return true;
      });
      
      // If filtering by difficulty leaves us with no snippets, fall back to all snippets for this cloud
      if (filteredSnippets.length === 0) {
        console.log(`Warning: No code snippets match the selected difficulty level. Using all snippets for ${settings.cloud} cloud.`);
        filteredSnippets = preFilteredByDifficulty;
      }
      
      let shuffled = [...filteredSnippets].sort(() => 0.5 - Math.random());
      
      // If we don't have enough code snippets, adjust the count
      const availableCount = Math.min(shuffled.length, settings.codeSnippetCount);
      
      if (availableCount < settings.codeSnippetCount) {
        console.log(`Warning: Only ${availableCount} code snippets available for ${settings.cloud} cloud. Using all available snippets.`);
      }
      
      // Set code snippets based on what's available
      setCodeSnippets(shuffled.slice(0, availableCount));
    });
  };
  
  // Update settings
  const updateSettings = (newSettings: Partial<InterviewSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };
  
  // Start the interview
  const startInterview = () => {
    fetchQuestionsAndCodeSnippets();
    setQuestionIndex(0);
    setCodeSnippetIndex(-1);
    setAnswers({});
    setCodeAnswers({});
    setInterviewInProgress(true);
    setStartTime(new Date());
    setTimeRemaining(settings.timeLimit * 60); // Convert minutes to seconds
    
    // Clear any existing timer to prevent multiple instances
    if (window.interviewTimer) {
      clearInterval(window.interviewTimer);
    }
    
    // Set up a timer to update timeRemaining
    window.interviewTimer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(window.interviewTimer);
          finishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update every second (1000ms)
    
    // Clean up the timer when the component unmounts
    return () => {
      if (window.interviewTimer) {
        clearInterval(window.interviewTimer);
      }
    };
  };
  
  // Answer a question
  const answerQuestion = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };
  
  // Answer a code issue
  const answerCodeIssue = (snippetId: string, issueIndex: number, fixIndex: number) => {
    setCodeAnswers(prev => {
      const snippetAnswers = prev[snippetId] || [];
      const existingAnswerIndex = snippetAnswers.findIndex(a => a.issueId === issueIndex);
      
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const newSnippetAnswers = [...snippetAnswers];
        newSnippetAnswers[existingAnswerIndex] = { issueId: issueIndex, fixId: fixIndex };
        return { ...prev, [snippetId]: newSnippetAnswers };
      } else {
        // Add new answer
        return { 
          ...prev, 
          [snippetId]: [...snippetAnswers, { issueId: issueIndex, fixId: fixIndex }]
        };
      }
    });
  };
  
  // Move to the next question
  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      // Move to code snippets if finished with questions
      setQuestionIndex(-1);
      setCodeSnippetIndex(0);
    }
  };
  
  // Move to the next code snippet
  const nextCodeSnippet = () => {
    // If codeSnippetIndex is -1, set it to 0 (first code snippet)
    // instead of incrementing it to ensure we always start with the first snippet
    if (codeSnippetIndex === -1) {
      setCodeSnippetIndex(0);
    } else if (codeSnippetIndex < codeSnippets.length - 1) {
      setCodeSnippetIndex(prev => prev + 1);
    } else {
      finishInterview();
    }
  };
  
  // Calculate and finish the interview
  const finishInterview = () => {
    if (!interviewInProgress) return;
    
    // Calculate time spent
    const timeSpent = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;
    
    // Calculate question scores
    const questionScores = questions.map(question => {
      const answerIndex = answers[question.id];
      const score = answerIndex !== undefined ? question.possibleAnswers[answerIndex].score : 0;
      return { questionId: question.id, score };
    });
    
    // Calculate code snippet scores - only applicable for developer role
    const codeScores = settings.role === 'developer' 
      ? codeSnippets.map(snippet => {
          const snippetAnswers = codeAnswers[snippet.id] || [];
          let snippetScore = 0;
          
          snippet.issues.forEach((issue, issueIndex) => {
            const answer = snippetAnswers.find(a => a.issueId === issueIndex);
            if (answer) {
              snippetScore += issue.possibleFixes[answer.fixId].score;
            }
          });
          
          return { snippetId: snippet.id, score: snippetScore };
        })
      : []; // Empty array for consultants
    
    // Calculate total score
    const totalScore = [
      ...questionScores.map(q => q.score),
      ...codeScores.map(c => c.score),
    ].reduce((sum, score) => sum + score, 0);
    
    // Update results
    setResults({
      totalScore,
      questionScores,
      codeScores,
      timeSpent,
    });
    
    setInterviewInProgress(false);
    setQuestionIndex(-1);
    setCodeSnippetIndex(-1);
  };

  // Reset the interview
  const resetInterview = () => {
    // Clear the timer if it exists
    if (window.interviewTimer) {
      clearInterval(window.interviewTimer);
      window.interviewTimer = undefined;
    }
    
    // Reset all states related to the interview
    setQuestions([]);
    setCodeSnippets([]);
    setQuestionIndex(-1);
    setCodeSnippetIndex(-1);
    setAnswers({});
    setCodeAnswers({});
    setResults({
      totalScore: 0,
      questionScores: [],
      codeScores: [],
      timeSpent: 0,
    });
    setInterviewInProgress(false);
    setStartTime(null);
    setTimeRemaining(0);
    
    // Reset only the candidate name, keeping the rest of the settings
    setSettings(prev => ({
      ...prev,
      candidateName: ''
    }));
  };
  
  return (
    <InterviewContext.Provider
      value={{
        settings,
        updateSettings,
        currentQuestion: questionIndex >= 0 && questionIndex < questions.length ? questions[questionIndex] : null,
        currentCodeSnippet: codeSnippetIndex >= 0 && codeSnippetIndex < codeSnippets.length ? codeSnippets[codeSnippetIndex] : null,
        answers,
        codeAnswers,
        results,
        startInterview,
        answerQuestion,
        answerCodeIssue,
        nextQuestion,
        nextCodeSnippet,
        finishInterview,
        resetInterview,
        interviewInProgress,
        questionIndex,
        codeSnippetIndex,
        timeRemaining,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterviewContext() {
  const context = useContext(InterviewContext);
  
  if (context === undefined) {
    throw new Error('useInterviewContext must be used within an InterviewProvider');
  }
  
  return context;
}