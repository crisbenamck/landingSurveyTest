import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useInterviewContext } from '@hooks/useInterviewContext';

// Components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 1rem;
  font-weight: 500;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  border-radius: 0;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: none;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  border-radius: 0;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: none;
  }
`;

const Separator = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey[200]};
  margin: 1.5rem 0;
`;

const StartButton = styled.button`
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: 0;
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  align-self: flex-start;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
  
  &:focus {
    outline: none;
  }
`;

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, startInterview } = useInterviewContext();
  
  const handleStartInterview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate settings
    if (!settings.candidateName.trim()) {
      alert('Please enter the candidate name');
      return;
    }
    
    // Set appropriate categories based on role
    if (settings.role === 'consultant') {
      // Consultants only get marketing_cloud category
      updateSettings({ 
        codeSnippetCount: 0,
        selectedCategories: ['marketing_cloud']
      });
    } else {
      // Developers get all categories
      updateSettings({ 
        selectedCategories: ['ampscript', 'ssjs', 'marketing_cloud']
      });
    }
    
    // Start the interview and navigate to questions page
    startInterview();
    navigate('/questions');
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Description>This tool assists interviewers during the selection process for Marketing Cloud roles in GToS. It provides a structured framework to evaluate candidate skills and knowledge across key Marketing Cloud technologies and practices.</Description>
        <Title>Interview Configuration</Title>
        <Subtitle>Complete the following information to start a technical assessment</Subtitle>
      </PageHeader>
      
      <Form onSubmit={handleStartInterview}>
        <FormGroup>
          <Label htmlFor="candidateName">Candidate Name</Label>
          <Input
            id="candidateName"
            type="text"
            value={settings.candidateName}
            onChange={(e) => updateSettings({ candidateName: e.target.value })}
            placeholder="Enter candidate name"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="role">Role</Label>
          <Select
            id="role"
            value={settings.role}
            onChange={(e) => updateSettings({ role: e.target.value as 'developer' | 'consultant' })}
          >
            <option value="developer">Developer</option>
            <option value="consultant">Consultant</option>
          </Select>
        </FormGroup>
        
        <Separator />
        
        <FormGroup>
          <Label htmlFor="seniority">Seniority</Label>
          <Select
            id="seniority"
            value={settings.seniority}
            onChange={(e) => updateSettings({ seniority: e.target.value as 'Junior' | 'Advanced' | 'Senior' | 'Specialist' })}
          >
            <option value="Junior">Junior</option>
            <option value="Advanced">Advanced</option>
            <option value="Senior">Senior</option>
            <option value="Specialist">Specialist</option>
          </Select>
        </FormGroup>
        
        <Separator />
        
        <FormGroup>
          <Label htmlFor="questionCount">Number of Questions</Label>
          <Input
            id="questionCount"
            type="number"
            min="1"
            max="15"
            value={isNaN(settings.questionCount) ? '' : settings.questionCount}
            onChange={(e) => updateSettings({ questionCount: parseInt(e.target.value) || 0 })}
          />
        </FormGroup>
        
        {settings.role === 'developer' && (
          <FormGroup>
            <Label htmlFor="codeSnippetCount">Number of Code Exercises</Label>
            <Input
              id="codeSnippetCount"
              type="number"
              min="1"
              max="5"
              value={isNaN(settings.codeSnippetCount) ? '' : settings.codeSnippetCount}
              onChange={(e) => updateSettings({ codeSnippetCount: parseInt(e.target.value) || 0 })}
            />
          </FormGroup>
        )}
        
        <FormGroup>
          <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
          <Input
            id="timeLimit"
            type="number"
            min="5"
            max="120"
            value={isNaN(settings.timeLimit) ? '' : settings.timeLimit}
            onChange={(e) => updateSettings({ timeLimit: parseInt(e.target.value) || 0 })}
          />
        </FormGroup>
        
        <StartButton type="submit">Start Interview</StartButton>
      </Form>
    </PageContainer>
  );
};

export default ConfigPage;