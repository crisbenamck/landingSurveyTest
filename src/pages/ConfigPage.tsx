import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useInterviewContext } from '@hooks/useInterviewContext';
import { getCloudAvailability } from '@utils/questionUtils';

// Components
const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 1rem;
  font-weight: 500;
  font-family: 'Bower', 'Times New Roman', Times, serif;
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
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2251ff;
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  border-radius: 0;
  font-size: 1rem;
  transition: all 0.2s ease;
  appearance: none; /* Remove default appearance */
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
  padding-right: 2.5rem; /* Add space for the custom arrow */
  
  &:hover {
    border-color: #2251ff;
  }
  
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
  background-color: #2251ff;
  color: white;
  border: 1px solid transparent;
  border-radius: 0;
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  align-self: flex-start;
  
  &:hover {
    background-color: white;
    color: #2251ff;
    border-color: #2251ff;
  }
  
  &:focus {
    outline: none;
  }
`;

// Helper function to get categories based on selected cloud
const getCloudCategories = (cloud: string): string[] => {
  switch (cloud) {
    case 'marketing':
      return ['ampscript', 'ssjs', 'marketing_cloud'];
    case 'sales':
      return ['apex', 'lwc', 'sales_cloud'];
    case 'service':
      return ['apex', 'lwc', 'service_cloud'];
    case 'commerce':
      return ['b2c', 'b2b', 'commerce_cloud'];
    case 'cpq':
      return ['cpq_admin', 'cpq_dev', 'cpq'];
    case 'pardot':
      return ['pardot_admin', 'pardot_dev', 'pardot'];
    default:
      return ['marketing_cloud'];
  }
};

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, startInterview } = useInterviewContext();
  const [cloudAvailability, setCloudAvailability] = useState(() => getCloudAvailability(settings.cloud));
  
  // Update cloud availability when cloud changes
  useEffect(() => {
    const availability = getCloudAvailability(settings.cloud);
    console.log('Cloud Availability:', availability);
    setCloudAvailability(availability);
    
    // Adjust settings based on availability
    const updates: Partial<{
      role: 'developer' | 'consultant';
      seniority: 'Junior' | 'Advanced' | 'Senior' | 'Specialist';
      questionCount: number;
      codeSnippetCount: number;
    }> = {};
    
    // Adjust role if current role is not available
    if (!availability.availableRoles.includes(settings.role)) {
      updates.role = availability.availableRoles[0];
    }
    
    // Adjust seniority if current seniority is not available
    if (!availability.availableSeniorities.includes(settings.seniority)) {
      updates.seniority = availability.availableSeniorities[0];
    }
    
    // Cap question count based on availability
    if (settings.questionCount > availability.maxQuestions) {
      updates.questionCount = availability.maxQuestions;
    }
    
    // Cap code snippet count based on availability
    if (settings.codeSnippetCount > availability.maxCodeSnippets) {
      updates.codeSnippetCount = availability.maxCodeSnippets;
    }
    
    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      updateSettings(updates);
    }
  }, [settings.cloud]);
  
  const handleStartInterview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate settings
    if (!settings.candidateName.trim()) {
      alert('Please enter the candidate name');
      return;
    }
    
    // Set appropriate categories based on role and selected cloud
    if (settings.role === 'consultant') {
      // Consultants only get general categories for the selected cloud
      updateSettings({ 
        codeSnippetCount: 0,
        selectedCategories: [`${settings.cloud}_cloud`]
      });
    } else {
      // Developers get all categories for the selected cloud
      const cloudCategories = getCloudCategories(settings.cloud);
      updateSettings({ 
        selectedCategories: cloudCategories
      });
    }
    
    // Start the interview and navigate to questions page
    startInterview();
    navigate('/questions');
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Description>This tool assists interviewers during the selection process for various Salesforce cloud roles in GToS. It provides a structured framework to evaluate candidate skills and knowledge across key Salesforce technologies and practices including Marketing Cloud, Sales Cloud, Service Cloud, Commerce Cloud, CPQ, and Pardot.</Description>
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
          <Label htmlFor="cloud">Salesforce Cloud</Label>
          <Select
            id="cloud"
            value={settings.cloud}
            onChange={(e) => updateSettings({ cloud: e.target.value as 'marketing' | 'sales' | 'service' | 'commerce' | 'cpq' | 'pardot' })}
          >
            <option value="marketing">Marketing Cloud</option>
            <option value="sales">Sales Cloud</option>
            <option value="service">Service Cloud</option>
            <option value="commerce">Commerce Cloud</option>
            <option value="cpq">CPQ</option>
            <option value="pardot">Pardot</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="role">Role</Label>
          <Select
            id="role"
            value={settings.role}
            onChange={(e) => updateSettings({ role: e.target.value as 'developer' | 'consultant' })}
          >
            {cloudAvailability.availableRoles.includes('developer') && (
              <option value="developer">Developer</option>
            )}
            {cloudAvailability.availableRoles.includes('consultant') && (
              <option value="consultant">Consultant</option>
            )}
          </Select>
          {cloudAvailability.codeSnippets === 0 && settings.role === 'developer' && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
              Developer role is not available for {settings.cloud} Cloud due to lack of code snippets.
            </div>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="seniority">Seniority</Label>
          <Select
            id="seniority"
            value={settings.seniority}
            onChange={(e) => updateSettings({ seniority: e.target.value as 'Junior' | 'Advanced' | 'Senior' | 'Specialist' })}
          >
            {cloudAvailability.availableSeniorities.includes('Junior') && (
              <option value="Junior">Junior</option>
            )}
            {cloudAvailability.availableSeniorities.includes('Advanced') && (
              <option value="Advanced">Advanced</option>
            )}
            {cloudAvailability.availableSeniorities.includes('Senior') && (
              <option value="Senior">Senior</option>
            )}
            {cloudAvailability.availableSeniorities.includes('Specialist') && (
              <option value="Specialist">Specialist</option>
            )}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="questionCount">Number of Questions (max: {cloudAvailability.maxQuestions})</Label>
          <Input
            id="questionCount"
            type="number"
            min="1"
            max={cloudAvailability.maxQuestions}
            value={isNaN(settings.questionCount) ? '' : settings.questionCount}
            onChange={(e) => updateSettings({ questionCount: Math.min(parseInt(e.target.value) || 0, cloudAvailability.maxQuestions) })}
          />
          {cloudAvailability.questions.total < 5 && (
            <div style={{ color: 'orange', fontSize: '0.8rem', marginTop: '5px' }}>
              Limited questions available for {settings.cloud} Cloud.
            </div>
          )}
        </FormGroup>
        
        {settings.role === 'developer' && cloudAvailability.codeSnippets > 0 && (
          <FormGroup>
            <Label htmlFor="codeSnippetCount">Number of Code Exercises (max: {cloudAvailability.maxCodeSnippets})</Label>
            <Input
              id="codeSnippetCount"
              type="number"
              min="0"
              max={cloudAvailability.maxCodeSnippets}
              value={isNaN(settings.codeSnippetCount) ? '' : settings.codeSnippetCount}
              onChange={(e) => updateSettings({ codeSnippetCount: Math.min(parseInt(e.target.value) || 0, cloudAvailability.maxCodeSnippets) })}
            />
            {cloudAvailability.codeSnippets < 3 && (
              <div style={{ color: 'orange', fontSize: '0.8rem', marginTop: '5px' }}>
                Limited code exercises available for {settings.cloud} Cloud.
              </div>
            )}
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