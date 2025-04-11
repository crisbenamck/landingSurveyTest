import { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  questionCount: number;
  codeSnippetCount: number;
  selectedCategories: string[];
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'mixed';
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
  questionCount: 5,
  codeSnippetCount: 3,
  selectedCategories: ['javascript', 'react', 'general'],
  difficultyLevel: 'mixed',
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
      
      if (settings.selectedCategories.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => 
          settings.selectedCategories.includes(q.category)
        );
      }
      
      if (settings.difficultyLevel !== 'mixed') {
        filteredQuestions = filteredQuestions.filter(q => 
          q.difficulty === settings.difficultyLevel
        );
      }
      
      // Shuffle and limit based on questionCount
      const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, settings.questionCount));
    });
    
    import('@data/codeSnippets.json').then((data) => {
      const shuffled = [...(data.default as CodeSnippet[])].sort(() => 0.5 - Math.random());
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
    
    // Calculate code snippet scores
    const codeScores = codeSnippets.map(snippet => {
      const snippetAnswers = codeAnswers[snippet.id] || [];
      let snippetScore = 0;
      
      snippet.issues.forEach((issue, issueIndex) => {
        const answer = snippetAnswers.find(a => a.issueId === issueIndex);
        if (answer) {
          snippetScore += issue.possibleFixes[answer.fixId].score;
        }
      });
      
      return { snippetId: snippet.id, score: snippetScore };
    });
    
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