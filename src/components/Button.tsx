import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'primary' | 'secondary' | 'cancel';
}

export const Button = styled.button<ButtonProps>`
  padding: 0.75rem 1.5rem;
  background-color: ${({ $variant = 'primary' }) =>
    $variant === 'secondary' ? '#f8f9fa' : 
    $variant === 'cancel' ? '#fff' : 
    '#2251ff'};
  color: ${({ $variant = 'primary' }) =>
    $variant === 'secondary' ? '#333333' : 
    $variant === 'cancel' ? '#2251ff' : 
    '#fff'};
  border: ${({ $variant = 'primary' }) =>
    $variant === 'secondary' ? '1px solid #e9ecef' : 
    $variant === 'cancel' ? '1px solid #2251ff' : 
    'none'};
  border-radius: 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  
  &:hover {
    background-color: ${({ $variant = 'primary' }) => 
      $variant === 'secondary' ? '#333333' : 
      $variant === 'cancel' ? '#2251ff' : 
      '#fff'};
    color: ${({ $variant = 'primary' }) => 
      $variant === 'secondary' ? '#fff' : 
      $variant === 'cancel' ? '#fff' : 
      '#2251ff'};
    border: 1px solid ${({ $variant = 'primary' }) => 
      $variant === 'secondary' ? '#333333' : 
      '#2251ff'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(34, 81, 255, 0.25);
  }
  
  &:disabled {
    background-color: #e9ecef;
    color: #adb5bd;
    border: none;
    cursor: not-allowed;
    &:hover {
      background-color: #e9ecef;
      color: #adb5bd;
      border: none;
    }
  }
`;
