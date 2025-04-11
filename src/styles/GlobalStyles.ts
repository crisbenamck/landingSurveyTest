import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
    background-color: #ffffff;
    color: #333333;
    min-height: 100vh;
  }
  
  body {
    line-height: 1.6;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
    margin-bottom: 1rem;
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
  }
`;