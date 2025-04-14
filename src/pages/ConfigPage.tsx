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

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  background-color: ${({ theme, checked }: { theme: any; checked: boolean }) =>
    checked ? theme.colors.primary.main : theme.colors.grey[200]};
  color: ${({ theme, checked }: { theme: any; checked: boolean }) =>
    checked ? '#ffffff' : theme.colors.text.primary};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, checked }: { theme: any; checked: boolean }) =>
      checked ? theme.colors.primary.dark : theme.colors.grey[300]};
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
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
  
  const categories = [
    { id: 'ampscript', label: 'AMPscript' },
    { id: 'ssjs', label: 'Server-Side JavaScript' },
    { id: 'marketing_cloud', label: 'Marketing Cloud' },
  ];
  
  const handleCategoryToggle = (categoryId: string) => {
    const selectedCategories = [...settings.selectedCategories];
    
    if (selectedCategories.includes(categoryId)) {
      updateSettings({
        selectedCategories: selectedCategories.filter(id => id !== categoryId)
      });
    } else {
      updateSettings({
        selectedCategories: [...selectedCategories, categoryId]
      });
    }
  };
  
  const handleStartInterview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate settings
    if (!settings.candidateName.trim()) {
      alert('Please enter the candidate name');
      return;
    }
    
    if (settings.selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }
    
    // Start the interview and navigate to questions page
    startInterview();
    navigate('/questions');
  };
  
  return (
    <PageContainer>
      <PageHeader>
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
        
        <Separator />
        
        <FormGroup>
          <Label>Categories</Label>
          <CheckboxGroup>
            {categories.map((category) => (
              <CheckboxLabel key={category.id} checked={settings.selectedCategories.includes(category.id)}>
                <HiddenCheckbox
                  checked={settings.selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                {category.label}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            id="difficulty"
            value={settings.difficultyLevel}
            onChange={(e) => updateSettings({ difficultyLevel: e.target.value as any })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="mixed">Mixed</option>
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
            value={settings.questionCount}
            onChange={(e) => updateSettings({ questionCount: parseInt(e.target.value) })}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="codeSnippetCount">Number of Code Exercises</Label>
          <Input
            id="codeSnippetCount"
            type="number"
            min="1"
            max="5"
            value={settings.codeSnippetCount}
            onChange={(e) => updateSettings({ codeSnippetCount: parseInt(e.target.value) })}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
          <Input
            id="timeLimit"
            type="number"
            min="5"
            max="120"
            value={settings.timeLimit}
            onChange={(e) => updateSettings({ timeLimit: parseInt(e.target.value) })}
          />
        </FormGroup>
        
        <StartButton type="submit">Start Interview</StartButton>
      </Form>
    </PageContainer>
  );
};

export default ConfigPage;