import { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
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
  seniority: 'Junior' | 'Advanced' | 'Senior' | 'Specialist'; // Nuevos niveles de seniority
  questionCount: number;
  codeSnippetCount: number;
  selectedCategories: string[];
  timeLimit: number; // in minutes
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
      let originalQuestions = [...filteredQuestions]; // Keep a copy of all questions
      
      // Filter by categories based on role
      if (settings.selectedCategories.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => 
          settings.selectedCategories.includes(q.category)
        );
      }
      
      // Filter by difficulty based on seniority
      const allowedDifficulties: Record<string, string[]> = {
        'Junior': ['easy'],
        'Advanced': ['easy', 'medium'],
        'Senior': ['easy', 'medium', 'hard'],
        'Specialist': ['medium', 'hard', 'expert'] // Specialist ahora puede ver preguntas expert
      };
      
      // Safety check: ensure seniority is a valid value
      const seniority = settings.seniority || 'Junior';
      const validSeniority = ['Junior', 'Advanced', 'Senior', 'Specialist'].includes(seniority) 
        ? seniority 
        : 'Junior';
      
      filteredQuestions = filteredQuestions.filter(q => 
        allowedDifficulties[validSeniority].includes(q.difficulty)
      );
      
      // Shuffle and limit based on questionCount
      let shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
      
      // If we don't have enough questions after filtering, use questions from the original list to fill the gap
      if (shuffled.length < settings.questionCount) {
        console.log(`Warning: Only ${shuffled.length} questions match the current filters. Adding additional questions to reach the requested count of ${settings.questionCount}.`);
        
        // Get questions that weren't already selected
        const remainingQuestions = originalQuestions.filter(
          q => !shuffled.some(sq => sq.id === q.id)
        );
        
        // Sort remaining questions by closest difficulty level to what was requested
        const sortedRemaining = [...remainingQuestions].sort((a, b) => {
          // Calculate difficulty priority (lower is better)
          const difficultyPriority: Record<string, number> = {
            'easy': 0,
            'medium': 1,
            'hard': 2,
            'expert': 3
          };
          
          // First prioritize by category match
          const aCategoryMatch = settings.selectedCategories.includes(a.category) ? 0 : 1;
          const bCategoryMatch = settings.selectedCategories.includes(b.category) ? 0 : 1;
          
          if (aCategoryMatch !== bCategoryMatch) {
            return aCategoryMatch - bCategoryMatch;
          }
          
          // Then by difficulty appropriate for the level
          const aDiffIdx = difficultyPriority[a.difficulty];
          const bDiffIdx = difficultyPriority[b.difficulty];
          
          return aDiffIdx - bDiffIdx;
        });
        
        // Add needed questions to reach the count
        const additionalNeeded = settings.questionCount - shuffled.length;
        const additionalQuestions = sortedRemaining.slice(0, additionalNeeded);
        
        shuffled = [...shuffled, ...additionalQuestions];
      }
      
      // Ensure we only take the exact count requested
      setQuestions(shuffled.slice(0, settings.questionCount));
    });
    
    import('@data/codeSnippets.json').then((data) => {
      let filteredSnippets = data.default as CodeSnippet[];
      let originalSnippets = [...filteredSnippets]; // Keep a copy of all snippets
      
      // Filter by difficulty based on seniority
      const allowedDifficulties: Record<string, string[]> = {
        'Junior': ['easy'],
        'Advanced': ['easy', 'medium'],
        'Senior': ['easy', 'medium', 'hard'],
        'Specialist': ['medium', 'hard', 'expert'] // Specialist ahora puede ver preguntas expert
      };
      
      // Safety check: ensure seniority is a valid value
      const seniority = settings.seniority || 'Junior';
      const validSeniority = ['Junior', 'Advanced', 'Senior', 'Specialist'].includes(seniority) 
        ? seniority 
        : 'Junior';
      
      // Assuming code snippets also have a difficulty property
      filteredSnippets = filteredSnippets.filter(snippet => {
        // If snippet has a difficulty property, filter by that
        if ('difficulty' in snippet) {
          return allowedDifficulties[validSeniority].includes((snippet as any).difficulty);
        }
        // Otherwise include all snippets
        return true;
      });
      
      let shuffled = [...filteredSnippets].sort(() => 0.5 - Math.random());
      
      // If we don't have enough code snippets after filtering, use snippets from the original list to fill the gap
      if (shuffled.length < settings.codeSnippetCount) {
        console.log(`Warning: Only ${shuffled.length} code snippets match the current filters. Adding additional snippets to reach the requested count of ${settings.codeSnippetCount}.`);
        
        // Get snippets that weren't already selected
        const remainingSnippets = originalSnippets.filter(
          s => !shuffled.some(ss => ss.id === s.id)
        );
        
        // Sort remaining snippets by closest difficulty level to what was requested (if applicable)
        const sortedRemaining = [...remainingSnippets].sort((a, b) => {
          // If snippets have difficulty property, sort by that
          if ('difficulty' in a && 'difficulty' in b) {
            const difficultyPriority: Record<string, number> = {
              'easy': 0,
              'medium': 1,
              'hard': 2,
              'expert': 3
            };
            
            const aDiffIdx = difficultyPriority[(a as any).difficulty] || 0;
            const bDiffIdx = difficultyPriority[(b as any).difficulty] || 0;
            
            return aDiffIdx - bDiffIdx;
          }
          
          // Otherwise don't change order
          return 0;
        });
        
        // Add needed snippets to reach the count
        const additionalNeeded = settings.codeSnippetCount - shuffled.length;
        const additionalSnippets = sortedRemaining.slice(0, additionalNeeded);
        
        shuffled = [...shuffled, ...additionalSnippets];
      }
      
      // Ensure we only take the exact count requested
      setCodeSnippets(shuffled.slice(0, settings.codeSnippetCount));
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
    
    // Set up a timer to update timeRemaining
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          finishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
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
    if (codeSnippetIndex < codeSnippets.length - 1) {
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