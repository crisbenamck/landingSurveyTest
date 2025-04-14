import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useInterviewContext } from '@hooks/useInterviewContext';

// Styled components
const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary.main};
  margin: 0;
  font-weight: 500;
`;

const Timer = styled.div`
  background-color: ${({ theme, timeRunningOut }: { theme: any; timeRunningOut: boolean }) => 
    timeRunningOut ? theme.colors.error.light : theme.colors.grey[100]};
  color: ${({ theme, timeRunningOut }: { theme: any; timeRunningOut: boolean }) => 
    timeRunningOut ? theme.colors.text.light : theme.colors.text.primary};
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  border-left: 3px solid ${({ theme, timeRunningOut }: { theme: any; timeRunningOut: boolean }) => 
    timeRunningOut ? theme.colors.error.main : theme.colors.grey[400]};
  animation: ${({ timeRunningOut }: { timeRunningOut: boolean }) => 
    timeRunningOut ? 'pulse 1s infinite' : 'none'};
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }
`;

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background-color: ${({ theme, color }: { theme: any; color: string }) => theme.colors[color].light};
  color: ${({ theme, color }: { theme: any; color: string }) => theme.colors[color].dark};
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-left: 3px solid ${({ theme, color }: { theme: any; color: string }) => theme.colors[color].main};
`;

const QuestionText = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.4;
`;

const ProgressContainer = styled.div`
  margin-bottom: 2.5rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: ${({ theme }) => theme.colors.grey[200]};
  overflow: hidden;
`;

const Progress = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => `${percent}%`};
  background-color: ${({ theme }) => theme.colors.primary.main};
  transition: width 0.3s ease;
`;

const AnswersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const AnswerOption = styled.div<{ isSelected: boolean }>`
  border: 1px solid ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary.main : theme.colors.grey[300]};
  border-left: 4px solid ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary.main : theme.colors.grey[300]};
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary.light + '10' : 'transparent'};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.light};
    background-color: ${({ theme }) => theme.colors.primary.light + '05'};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  border-top: 1px solid ${({ theme }) => theme.colors.grey[200]};
  padding-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme, variant }) => 
    variant === 'secondary' ? 'transparent' : theme.colors.primary.main};
  color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.colors.text.primary : 'white'};
  border: ${({ theme, variant }) => 
    variant === 'secondary' ? `1px solid ${theme.colors.grey[300]}` : 'none'};
  border-radius: 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, variant }) => 
      variant === 'secondary' ? theme.colors.grey[200] : theme.colors.primary.dark};
  }
  
  &:focus {
    outline: none;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  const { 
    currentQuestion, 
    questionIndex,
    answers,
    answerQuestion,
    nextQuestion,
    timeRemaining,
    settings
  } = useInterviewContext();
  
  // Format time remaining
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Check if time is running out (less than 20% remaining)
  const isTimeRunningOut = timeRemaining < (settings.timeLimit * 60 * 0.2);
  
  // Calculate progress percentage
  const progressPercent = questionIndex === -1 ? 100 : ((questionIndex + 1) / settings.questionCount) * 100;
  
  // Handle answer selection
  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    
    if (currentQuestion) {
      answerQuestion(currentQuestion.id, index);
    }
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    nextQuestion();
    
    // If we've moved beyond questions, go to code snippets
    if (questionIndex === -1) {
      navigate('/code-correction');
    }
  };
  
  // If no current question, redirect to the proper page
  React.useEffect(() => {
    if (questionIndex === -1) {
      navigate('/code-correction');
    }
  }, [questionIndex, navigate]);
  
  if (!currentQuestion) {
    return null;
  }
  
  // Get selected answer for this question from context
  const savedAnswer = currentQuestion.id in answers 
    ? answers[currentQuestion.id]
    : null;
  
  // Use the saved answer if available
  const effectiveSelectedAnswer = 
    selectedAnswer !== null ? selectedAnswer : savedAnswer;
  
  return (
    <PageContainer>
      <Header>
        <Title>Technical Questions</Title>
        <Timer timeRunningOut={isTimeRunningOut}>
          {formatTime(timeRemaining)}
        </Timer>
      </Header>
      
      <ProgressContainer>
        <ProgressLabel>
          <span>Question {questionIndex + 1} of {settings.questionCount}</span>
          <span>{Math.round(progressPercent)}% Complete</span>
        </ProgressLabel>
        <ProgressBar>
          <Progress percent={progressPercent} />
        </ProgressBar>
      </ProgressContainer>
      
      <QuestionContainer>
        <QuestionMeta>
          <Tag color={
            currentQuestion.difficulty === 'easy' ? 'success' :
            currentQuestion.difficulty === 'medium' ? 'warning' :
            'error'
          }>
            {
              currentQuestion.difficulty === 'easy' ? 'Easy' :
              currentQuestion.difficulty === 'medium' ? 'Medium' :
              'Hard'
            }
          </Tag>
          <Tag color="secondary">{currentQuestion.category}</Tag>
        </QuestionMeta>
        
        <QuestionText>{currentQuestion.text}</QuestionText>
        
        <AnswersList>
          {currentQuestion.possibleAnswers.map((answer, index) => (
            <AnswerOption
              key={index}
              isSelected={effectiveSelectedAnswer === index}
              onClick={() => handleAnswerSelect(index)}
            >
              {answer.text}
            </AnswerOption>
          ))}
        </AnswersList>
      </QuestionContainer>
      
      <ButtonsContainer>
        <Button 
          variant="secondary"
          onClick={() => navigate('/')}
        >
          Cancel Interview
        </Button>
        
        <Button
          onClick={handleNextQuestion}
          disabled={effectiveSelectedAnswer === null}
        >
          {questionIndex === settings.questionCount - 1 ? 'Go to Code Exercises' : 'Next Question'}
        </Button>
      </ButtonsContainer>
    </PageContainer>
  );
};

export default QuestionsPage;