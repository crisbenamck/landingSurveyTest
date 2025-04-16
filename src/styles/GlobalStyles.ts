import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    /* Force the scrollbar to always be visible to avoid layout jumps */
    overflow-y: scroll;
    scrollbar-width: thin; /* For Firefox */
    scrollbar-color: #CCC #F4F4F4; /* For Firefox */
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
    background-color: #ffffff;
    color: #333333;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Scrollbar style for webkit browsers (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #F4F4F4; 
  }
  
  ::-webkit-scrollbar-thumb {
    background: #CCC;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
  
  body {
    line-height: 1.6;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
    margin-bottom: 1rem;
    letter-spacing: -0.01em;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: #003d7d;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #3366a5;
    }
  }
  
  button {
    cursor: pointer;
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
  }
`;