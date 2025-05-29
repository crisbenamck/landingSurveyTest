import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useInterviewContext } from '@hooks/useInterviewContext';
import { getCloudDisplayName } from '../utils/cloudUtils';

// Styled components
const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: left;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-family: 'Bower', 'Times New Roman', Times, serif;
`;

const Subtitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 400;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ResultsContainer = styled.div``;

const SectionTitle = styled.h3`
  color: #333333;
  margin: 2rem 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  font-weight: 500;
`;

const ScoreSummary = styled.div<{ $score: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  border-left: 4px solid ${({ $score }) =>
    $score >= 80 ? '#198754' : $score >= 60 ? '#ffc107' : '#dc3545'};
  padding: 1.5rem;
  background-color: #f8f9fa;
`;

const ScoreText = styled.div`
  flex: 1;
`;

const ScoreLabel = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ScoreBadge = styled.div<{ $score: number }>`
  padding: 0.75rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ $score }) =>
    $score >= 80 ? '#0f5132' : $score >= 60 ? '#664d03' : '#842029'};
  border-left: 4px solid ${({ $score }) =>
    $score >= 80 ? '#198754' : $score >= 60 ? '#ffc107' : '#dc3545'};
  background-color: ${({ $score }) =>
    $score >= 80 ? '#d1e7dd' : $score >= 60 ? '#fff3cd' : '#f8d7da'};
  border-radius: 2px;
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0 2rem;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ScoreBreakdown = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  margin-bottom: 2rem;
`;

const ScoreItem = styled.div<{ $score: number }>`
  border-left: 4px solid ${({ $score }) =>
    $score >= 8 ? '#198754' : $score >= 5 ? '#ffc107' : '#dc3545'};
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
`;

const ScoreItemTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: #333333;
  font-weight: 500;
`;

const ScoreValue = styled.div<{ $score: number }>`
  color: ${({ $score }) =>
    $score >= 8 ? '#198754' : $score >= 5 ? '#ffc107' : '#dc3545'};
`;

const SummarySection = styled.div`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 2px solid ${({ theme }) => theme.colors.grey[200]};
`;

const SummaryTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

const SummaryDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  line-height: 1.5;
  font-size: 1.1rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 3rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'cancel' }>`
  padding: 0.75rem 1.5rem;
  background-color: ${({ $variant }) => 
    $variant === 'secondary' ? '#f8f9fa' : $variant === 'cancel' ? '#fff' : '#2251ff'};
  color: ${({ $variant }) => 
    $variant === 'secondary' ? '#333333' : $variant === 'cancel' ? '#2251ff' : '#fff'};
  border: ${({ $variant }) => 
    $variant === 'secondary' ? '1px solid #e9ecef' : $variant === 'cancel' ? '1px solid #2251ff' : 'none'};
  border-radius: 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ $variant }) => 
      $variant === 'secondary' ? '#333333' : 
      $variant === 'cancel' ? '#2251ff' : '#fff'};
    color: ${({ $variant }) => 
      $variant === 'secondary' ? '#fff' : 
      $variant === 'cancel' ? '#fff' : '#2251ff'};
    border: ${({ $variant }) => 
      $variant === 'secondary' ? '1px solid #333333' : '1px solid #2251ff'};
  }
  
  &:focus {
    outline: none;
  }
`;

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { results, settings, finishInterview, resetInterview } = useInterviewContext();

  // Make sure the interview is finished
  useEffect(() => {
    finishInterview();
  }, [finishInterview]);

  // Calculate percentages and total possible scores
  const calculateScorePercentage = (score: number, maxPossible: number): number => {
    return maxPossible === 0 ? 0 : Math.round((score / maxPossible) * 100);
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes and ${remainingSeconds} seconds`;
  };

  // Get feedback based on total score percentage
  const getFeedback = (percentage: number): string => {
    if (percentage >= 90) return "Excellent! You demonstrate exceptional knowledge in the evaluated topics.";
    if (percentage >= 80) return "Very good! You have a solid understanding of the evaluated concepts.";
    if (percentage >= 70) return "Good. You have shown good knowledge of the main topics.";
    if (percentage >= 60) return "Acceptable. You have basic knowledge but there are areas to improve.";
    if (percentage >= 50) return "Fair. You need to reinforce several important concepts.";
    return "You need to significantly improve your knowledge in these topics.";
  };

  // Calculate maximum possible score
  const totalMaxScore = 100; // This would typically be calculated based on the questions/code snippets
  const totalPercentage = calculateScorePercentage(results.totalScore, totalMaxScore);

  return (
    <PageContainer>
      <Header>
        <Title>Interview Results</Title>
        <Subtitle>Candidate: {settings.candidateName}</Subtitle>
        <Subtitle>Cloud: {getCloudDisplayName(settings.cloud)}</Subtitle>
      </Header>

      <ResultsContainer>
        <SectionTitle>Results Summary</SectionTitle>
        
        <ScoreSummary $score={totalPercentage}>
          <ScoreText>
            <ScoreLabel>Overall Score</ScoreLabel>
            <TimeDisplay>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Time used: {formatTime(results.timeSpent)}
            </TimeDisplay>
          </ScoreText>
          <ScoreBadge $score={totalPercentage}>{totalPercentage}%</ScoreBadge>
        </ScoreSummary>

        <SectionTitle>Technical Questions Details</SectionTitle>
        <ScoreBreakdown>
          {results.questionScores.map((score, index) => (
            <ScoreItem key={index} $score={score.score}>
              <ScoreItemTitle>Question {index + 1}</ScoreItemTitle>
              <ScoreValue $score={score.score}>{score.score} points</ScoreValue>
            </ScoreItem>
          ))}
        </ScoreBreakdown>

        {settings.role === 'developer' && results.codeScores.length > 0 && (
          <>
            <SectionTitle>Code Exercises Details</SectionTitle>
            <ScoreBreakdown>
              {results.codeScores.map((score, index) => (
                <ScoreItem key={index} $score={score.score}>
                  <ScoreItemTitle>Exercise {index + 1}</ScoreItemTitle>
                  <ScoreValue $score={score.score}>{score.score} points</ScoreValue>
                </ScoreItem>
              ))}
            </ScoreBreakdown>
          </>
        )}

        <SummarySection>
          <SummaryTitle>Final Evaluation</SummaryTitle>
          <SummaryDescription>{getFeedback(totalPercentage)}</SummaryDescription>
        </SummarySection>

        <ButtonsContainer>
          <Button $variant="cancel" onClick={() => window.print()}>
            Print Results
          </Button>
          <Button $variant="primary" onClick={() => {
            resetInterview();
            // Use setTimeout to ensure that reset completes before navigation
            setTimeout(() => {
              navigate('/');
            }, 0);
          }}>
            New Interview
          </Button>
        </ButtonsContainer>
      </ResultsContainer>
    </PageContainer>
  );
};

export default ResultsPage;