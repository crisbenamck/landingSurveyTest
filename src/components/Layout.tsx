import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useInterviewContext } from '@hooks/useInterviewContext';

// Importar el logo local directamente (esto es compatible con Vite)
import mcKinseyLogo from '../assets/mckinsey-logo.svg';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: #ffffff;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[200]};
  padding: 1.5rem 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: 600;
  font-size: 1.5rem;
`;

const LogoImg = styled.img`
  height: 40px;
  width: auto;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)<{ active: boolean }>`
  padding: 0.5rem 0;
  color: ${({ theme, active }) => 
    active ? theme.colors.primary.main : theme.colors.text.primary};
  border-bottom: ${({ theme, active }) => 
    active ? `2px solid ${theme.colors.primary.main}` : '2px solid transparent'};
  font-weight: ${({ active }) => active ? 500 : 400};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 0;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const Footer = styled.footer`
  background-color: #f5f5f5;
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  border-top: 1px solid ${({ theme }) => theme.colors.grey[200]};
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { interviewInProgress, settings } = useInterviewContext();
  
  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoImg src={mcKinseyLogo} alt="McKinsey Logo" />
            Technical Interview
          </Logo>
          
          <Nav>
            <NavLink to="/" active={location.pathname === '/'}>
              Home
            </NavLink>
            {interviewInProgress && (
              <>
                <NavLink to="/questions" active={location.pathname === '/questions'}>
                  Questions
                </NavLink>
                {settings.role === 'developer' && (
                  <NavLink to="/code-correction" active={location.pathname === '/code-correction'}>
                    Code Correction
                  </NavLink>
                )}
              </>
            )}
            {location.pathname === '/results' && (
              <NavLink to="/results" active={true}>
                Results
              </NavLink>
            )}
          </Nav>
        </HeaderContent>
      </Header>
      
      <Main>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </Main>
      
      <Footer>
        © {new Date().getFullYear()} Technical Interview - Evaluation System for Developers
      </Footer>
    </LayoutContainer>
  );
};

export default Layout;