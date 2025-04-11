import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useInterviewContext } from '@hooks/useInterviewContext';

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
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: 600;
  font-size: 1.5rem;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
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
  const { interviewInProgress } = useInterviewContext();
  
  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoIcon>IT</LogoIcon>
            Entrevista Técnica
          </Logo>
          
          <Nav>
            <NavLink to="/" active={location.pathname === '/'}>
              Inicio
            </NavLink>
            {interviewInProgress && (
              <>
                <NavLink to="/questions" active={location.pathname === '/questions'}>
                  Preguntas
                </NavLink>
                <NavLink to="/code-correction" active={location.pathname === '/code-correction'}>
                  Corrección de Código
                </NavLink>
              </>
            )}
            {location.pathname === '/results' && (
              <NavLink to="/results" active={true}>
                Resultados
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
        © {new Date().getFullYear()} Entrevista Técnica - Sistema de Evaluación para Desarrolladores
      </Footer>
    </LayoutContainer>
  );
};

export default Layout;