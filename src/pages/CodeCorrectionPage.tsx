import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useInterviewContext } from '@hooks/useInterviewContext';
import { Button } from '@components/Button';

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
  font-family: 'Bower', 'Times New Roman', Times, serif;
`;

const Timer = styled.div<{ $timeRunningOut: boolean }>`
  background-color: ${({ theme, $timeRunningOut }) => 
    $timeRunningOut ? theme.colors.error.light : theme.colors.grey[100]};
  color: ${({ theme, $timeRunningOut }) => 
    $timeRunningOut ? theme.colors.text.light : theme.colors.text.primary};
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  border-left: 3px solid ${({ theme, $timeRunningOut }) => 
    $timeRunningOut ? theme.colors.error.main : theme.colors.grey[400]};
  animation: ${({ $timeRunningOut }) => 
    $timeRunningOut ? 'pulse 1s infinite' : 'none'};
  
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

const Progress = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => `${$percent}%`};
  background-color: ${({ theme }) => theme.colors.primary.main};
  transition: width 0.3s ease;
`;

const CodeExerciseContainer = styled.div`
  margin-bottom: 2.5rem;
`;

const ExerciseHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Tag = styled.span<{ color: string }>`
  background-color: ${({ color }) => {
    if (color === 'primary') return '#cfe2ff';
    if (color === 'secondary') return '#e2e3e5';
    if (color === 'error') return '#f8d7da';
    if (color === 'success') return '#d1e7dd';
    if (color === 'warning') return '#fff3cd';
    return '#cfe2ff';
  }};
  color: ${({ color }) => {
    if (color === 'primary') return '#084298';
    if (color === 'secondary') return '#41464b';
    if (color === 'error') return '#842029';
    if (color === 'success') return '#0f5132';
    if (color === 'warning') return '#664d03';
    return '#084298';
  }};
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-left: 3px solid ${({ color }) => {
    if (color === 'primary') return '#0d6efd';
    if (color === 'secondary') return '#6c757d';
    if (color === 'error') return '#dc3545';
    if (color === 'success') return '#198754';
    if (color === 'warning') return '#ffc107';
    return '#0d6efd';
  }};
  border-radius: 2px;
`;

const CodeTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

const CodeDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const CodeContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  margin-bottom: 2.5rem;
`;

const CodeHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.grey[800]};
  color: white;
  padding: 0.5rem 1rem;
  font-family: monospace;
  font-size: 0.875rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[700]};
`;

const CodeContent = styled.pre`
  margin: 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.grey[900]};
  color: ${({ theme }) => theme.colors.grey[200]};
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  counter-reset: line;
  
  & code {
    counter-increment: line;
    display: block;
    position: relative;
    padding-left: 2.5rem;
  }
  
  & code:before {
    content: counter(line);
    position: absolute;
    left: 0;
    width: 2rem;
    text-align: right;
    color: ${({ theme }) => theme.colors.grey[600]};
    padding-right: 0.5rem;
    border-right: 1px solid ${({ theme }) => theme.colors.grey[700]};
  }
`;

const CodeLine = styled.code<{ $isError?: boolean }>`
  background-color: ${({ $isError, theme }) => 
    $isError ? theme.colors.error.main + '30' : 'transparent'};
`;

const IssuesContainer = styled.div`
  margin-top: 2.5rem;
`;

const IssueSection = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[200]};
`;

const IssueItem = styled.div`
  border-left: 4px solid ${({ theme }) => theme.colors.secondary.main};
  padding: 1.5rem;
  margin-bottom: 2rem;
  background-color: ${({ theme }) => theme.colors.grey[100]};
`;

const IssueHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const IssueTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.125rem;
  font-weight: 500;
`;

const IssueDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const FixOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FixOptionsLabel = styled.h5`
  margin: 0 0 0.75rem 0;
  font-weight: 500;
  font-size: 1rem;
`;

const FixOption = styled.div<{ $isSelected: boolean }>`
  border: 1px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.colors.primary.main : theme.colors.grey[300]};
  border-left: 4px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.colors.primary.main : theme.colors.grey[300]};
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $isSelected }) => 
    $isSelected ? theme.colors.primary.light + '10' : 'white'};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.light};
    background-color: ${({ theme }) => theme.colors.primary.light + '05'};
  }
`;

const FixCode = styled.pre`
  margin: 0.5rem 0 0;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.grey[100]};
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  border-top: 1px solid ${({ theme }) => theme.colors.grey[200]};
  padding-top: 2rem;
`;

const CodeCorrectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFixes, setSelectedFixes] = useState<Record<number, number>>({});
  const [allIssuesFixed, setAllIssuesFixed] = useState(false);
  
  const {
    currentCodeSnippet,
    codeSnippetIndex,
    settings,
    timeRemaining,
    codeAnswers,
    answerCodeIssue,
    nextCodeSnippet,
    resetInterview,
    interviewInProgress
  } = useInterviewContext();
  
  // If there's no current code snippet but we're on the page, 
  // start the first code exercise
  React.useEffect(() => {
    // If we're on the code correction page but there's no active snippet,
    // call nextCodeSnippet to set up the first exercise
    if (codeSnippetIndex === -1 && settings.codeSnippetCount > 0) {
      nextCodeSnippet();
    }
  }, [codeSnippetIndex, nextCodeSnippet, settings.codeSnippetCount]);
  
  // Format time remaining
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Check if time is running out (less than 20% remaining)
  const isTimeRunningOut = timeRemaining < (settings.timeLimit * 60 * 0.2);
  
  // Calculate progress percentage
  const progressPercent = codeSnippetIndex === -1 ? 0 : ((codeSnippetIndex + 1) / settings.codeSnippetCount) * 100;
  
  // Check if we have answers for current snippet
  useEffect(() => {
    if (currentCodeSnippet) {
      const snippetAnswers = codeAnswers[currentCodeSnippet.id] || [];
      const newSelectedFixes: Record<number, number> = {};
      
      // Populate selected fixes from existing answers
      snippetAnswers.forEach(answer => {
        newSelectedFixes[answer.issueId] = answer.fixId;
      });
      
      setSelectedFixes(newSelectedFixes);
      
      // Check if all issues are addressed
      const allFixed = currentCodeSnippet.issues.every(
        (_, index) => index in newSelectedFixes
      );
      
      setAllIssuesFixed(allFixed);
    }
  }, [currentCodeSnippet, codeAnswers]);
  
  // Handle fix selection
  const handleSelectFix = (issueIndex: number, fixIndex: number) => {
    // First, save the answer to the context if we have a current snippet
    if (currentCodeSnippet) {
      answerCodeIssue(currentCodeSnippet.id, issueIndex, fixIndex);
    }
    
    // Then update local state with the new selection
    setSelectedFixes(prev => {
      const newFixes = { ...prev, [issueIndex]: fixIndex };
      
      // Update the "all fixed" state in the next tick to avoid nested setState calls
      setTimeout(() => {
        const allFixed = currentCodeSnippet?.issues.every(
          (_, index) => index in newFixes
        ) || false;
        
        setAllIssuesFixed(allFixed);
      }, 0);
      
      return newFixes;
    });
  };
  
  // Handle next code snippet
  const handleNext = () => {
    // If we're on the last exercise, navigate directly to results
    if (codeSnippetIndex === settings.codeSnippetCount - 1) {
      navigate('/results');
    } else {
      nextCodeSnippet();
      
      // Reset local state
      setSelectedFixes({});
      setAllIssuesFixed(false);
      
      // Scroll to top of the page when changing questions
      window.scrollTo(0, 0);
    }
  };
  
  // If no current code snippet, redirect to the proper page
  React.useEffect(() => {
    // Only navigate to results if:
    // 1. The index is -1 (no current code snippet)
    // 2. The number of code snippets is configured (not 0)
    // 3. The interview is in progress
    // 4. We've already loaded the code snippets (arrays are not empty)
    if (codeSnippetIndex === -1 && 
        settings.codeSnippetCount > 0 && 
        interviewInProgress && 
        codeAnswers && 
        Object.keys(codeAnswers).length > 0) {
      navigate('/results');
    }
  }, [codeSnippetIndex, navigate, settings.codeSnippetCount, interviewInProgress, codeAnswers]);
  
  if (!currentCodeSnippet) {
    return null;
  }
  
  // Split code into lines
  const codeLines = currentCodeSnippet.code.split('\n');
  const errorLines = currentCodeSnippet.issues.map(issue => issue.line);
  
  return (
    <PageContainer>
      <Header>
        <Title>Code Correction</Title>
        <Timer $timeRunningOut={isTimeRunningOut}>
          {formatTime(timeRemaining)}
        </Timer>
      </Header>
      
      <ProgressContainer>
        <ProgressLabel>
          <span>Exercise {codeSnippetIndex + 1} of {settings.codeSnippetCount}</span>
          <span>{Math.round(progressPercent)}% Complete</span>
        </ProgressLabel>
        <ProgressBar>
          <Progress $percent={progressPercent} />
        </ProgressBar>
      </ProgressContainer>
      
      <CodeExerciseContainer>
        <ExerciseHeader>
          <TagsContainer>
            <Tag color="primary">
              Exercise {codeSnippetIndex + 1} of {settings.codeSnippetCount}
            </Tag>
            <Tag color="secondary">
              {currentCodeSnippet.language === 'javascript' ? 'JavaScript' :
               currentCodeSnippet.language === 'typescript' ? 'TypeScript' :
               currentCodeSnippet.language === 'ssjs' ? 'SSJS' :
               currentCodeSnippet.language === 'marketing_cloud' ? 'Marketing Cloud' :
               currentCodeSnippet.language === 'ampscript' ? 'AMPscript' :
               currentCodeSnippet.language.charAt(0).toUpperCase() + currentCodeSnippet.language.slice(1)}
            </Tag>
          </TagsContainer>
          
          <CodeTitle>{currentCodeSnippet.title}</CodeTitle>
          <CodeDescription>{currentCodeSnippet.description}</CodeDescription>
        </ExerciseHeader>
        
        <CodeContainer>
          <CodeHeader>
            {currentCodeSnippet.language === 'javascript' ? 'JavaScript' :
             currentCodeSnippet.language === 'typescript' ? 'TypeScript' :
             currentCodeSnippet.language === 'ssjs' ? 'SSJS' :
             currentCodeSnippet.language === 'marketing_cloud' ? 'Marketing Cloud' :
             currentCodeSnippet.language === 'ampscript' ? 'AMPscript' :
             currentCodeSnippet.language.charAt(0).toUpperCase() + currentCodeSnippet.language.slice(1)}
          </CodeHeader>
          <CodeContent>
            {codeLines.map((line, index) => (
              <CodeLine 
                key={index}
                $isError={errorLines.includes(index + 1)} // +1 because line numbers are 1-based
              >
                {line}
              </CodeLine>
            ))}
          </CodeContent>
        </CodeContainer>
        
        <IssuesContainer>
          <IssueSection>Issues to Fix</IssueSection>
          
          {currentCodeSnippet.issues.map((issue, issueIndex) => (
            <IssueItem key={issueIndex}>
              <IssueHeader>
                <IssueTitle>Issue at line {issue.line}</IssueTitle>
              </IssueHeader>
              
              <IssueDescription>{issue.description}</IssueDescription>
              
              <FixOptions>
                <FixOptionsLabel>Select the appropriate fix:</FixOptionsLabel>
                {issue.possibleFixes.map((fix, fixIndex) => (
                  <FixOption
                    key={fixIndex}
                    $isSelected={selectedFixes[issueIndex] === fixIndex}
                    onClick={() => handleSelectFix(issueIndex, fixIndex)}
                  >
                    <FixCode>{fix.text}</FixCode>
                  </FixOption>
                ))}
              </FixOptions>
            </IssueItem>
          ))}
        </IssuesContainer>
      </CodeExerciseContainer>
      
      <ButtonsContainer>
        <Button 
          $variant="cancel"
          onClick={() => {
            resetInterview();
            // Use setTimeout to ensure reset completes before navigating
            setTimeout(() => {
              navigate('/');
            }, 0);
          }}
        >
          Cancel Interview
        </Button>
        
        <Button
          $variant="primary"
          onClick={handleNext}
          disabled={!allIssuesFixed}
        >
          {codeSnippetIndex === settings.codeSnippetCount - 1 ? 'View Results' : 'Next Exercise'}
        </Button>
      </ButtonsContainer>
    </PageContainer>
  );
};

export default CodeCorrectionPage;