import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useInterviewContext } from '@hooks/useInterviewContext';

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
`;

const Subtitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 400;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ResultsContainer = styled.div``;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 2rem 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[200]};
  font-weight: 500;
`;

const ScoreSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  border-left: 4px solid ${({ theme, score }: { theme: any; score: number }) => 
    score >= 80 ? theme.colors.success.main :
    score >= 60 ? theme.colors.warning.main :
    theme.colors.error.main
  };
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.grey[100]};
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

const ScoreBadge = styled.div<{ score: number }>`
  padding: 0.75rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme, score }) => 
    score >= 80 ? theme.colors.success.dark :
    score >= 60 ? theme.colors.warning.dark :
    theme.colors.error.dark
  };
  border-left: 4px solid ${({ theme, score }) => 
    score >= 80 ? theme.colors.success.main :
    score >= 60 ? theme.colors.warning.main :
    theme.colors.error.main
  };
  background-color: ${({ theme, score }) => 
    score >= 80 ? theme.colors.success.light :
    score >= 60 ? theme.colors.warning.light :
    theme.colors.error.light
  };
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

const ScoreItem = styled.div`
  border-left: 4px solid ${({ theme, score }: { theme: any; score: number }) => 
    score >= 8 ? theme.colors.success.main :
    score >= 5 ? theme.colors.warning.main :
    theme.colors.error.main
  };
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.grey[100]};
`;

const ScoreItemTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

const ScoreValue = styled.div<{ score: number }>`
  font-weight: 600;
  font-size: 1.125rem;
  color: ${({ theme, score }) => 
    score >= 8 ? theme.colors.success.dark :
    score >= 5 ? theme.colors.warning.dark :
    theme.colors.error.dark
  };
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
`;

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { results, settings, finishInterview } = useInterviewContext();

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
    return `${minutes} minutos y ${remainingSeconds} segundos`;
  };

  // Get feedback based on total score percentage
  const getFeedback = (percentage: number): string => {
    if (percentage >= 90) return "¡Excelente! Demuestras un conocimiento excepcional en los temas evaluados.";
    if (percentage >= 80) return "¡Muy bien! Tienes un sólido dominio de los conceptos evaluados.";
    if (percentage >= 70) return "Bien. Has mostrado un buen conocimiento de los temas principales.";
    if (percentage >= 60) return "Aceptable. Tienes conocimientos básicos pero hay áreas por mejorar.";
    if (percentage >= 50) return "Regular. Necesitas reforzar varios conceptos importantes.";
    return "Necesitas mejorar significativamente tu conocimiento en estos temas.";
  };

  // Calculate maximum possible score
  const totalMaxScore = 100; // This would typically be calculated based on the questions/code snippets
  const totalPercentage = calculateScorePercentage(results.totalScore, totalMaxScore);

  return (
    <PageContainer>
      <Header>
        <Title>Resultados de la Entrevista</Title>
        <Subtitle>Candidato: {settings.candidateName}</Subtitle>
      </Header>

      <ResultsContainer>
        <SectionTitle>Resumen de Resultados</SectionTitle>
        
        <ScoreSummary score={totalPercentage}>
          <ScoreText>
            <ScoreLabel>Puntuación General</ScoreLabel>
            <TimeDisplay>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Tiempo utilizado: {formatTime(results.timeSpent)}
            </TimeDisplay>
          </ScoreText>
          <ScoreBadge score={totalPercentage}>{totalPercentage}%</ScoreBadge>
        </ScoreSummary>

        <SectionTitle>Detalle de Preguntas Técnicas</SectionTitle>
        <ScoreBreakdown>
          {results.questionScores.map((score, index) => (
            <ScoreItem key={index} score={score.score}>
              <ScoreItemTitle>Pregunta {index + 1}</ScoreItemTitle>
              <ScoreValue score={score.score}>{score.score} puntos</ScoreValue>
            </ScoreItem>
          ))}
        </ScoreBreakdown>

        <SectionTitle>Detalle de Ejercicios de Código</SectionTitle>
        <ScoreBreakdown>
          {results.codeScores.map((score, index) => (
            <ScoreItem key={index} score={score.score}>
              <ScoreItemTitle>Ejercicio {index + 1}</ScoreItemTitle>
              <ScoreValue score={score.score}>{score.score} puntos</ScoreValue>
            </ScoreItem>
          ))}
        </ScoreBreakdown>

        <SummarySection>
          <SummaryTitle>Evaluación Final</SummaryTitle>
          <SummaryDescription>{getFeedback(totalPercentage)}</SummaryDescription>
        </SummarySection>

        <ButtonsContainer>
          <Button variant="secondary" onClick={() => window.print()}>
            Imprimir Resultados
          </Button>
          <Button onClick={() => navigate('/')}>
            Nueva Entrevista
          </Button>
        </ButtonsContainer>
      </ResultsContainer>
    </PageContainer>
  );
};

export default ResultsPage;