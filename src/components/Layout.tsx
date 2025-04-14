import React, { useState, useEffect } from 'react';
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
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 70px;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const LogoImg = styled.img`
  height: 30px;
  width: auto;
`;

const LogoText = styled.span`
  color: #002373; /* McKinsey blue */
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2.5rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    right: 0;
    background-color: white;
    width: 250px;
    height: calc(100vh - 70px);
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    gap: 1.5rem;
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-in-out;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    z-index: 999;
  }
`;

const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
    width: 30px;
    height: 30px;
    position: relative;
  }
  
  &:focus {
    outline: none;
  }
`;

const HamburgerIcon = styled.div<{ $isOpen: boolean }>`
  position: relative;
  width: 30px;
  height: 24px;
  
  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: #002373;
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
    
    &:nth-child(1) {
      top: ${({ $isOpen }) => $isOpen ? '9px' : '0px'};
      transform: ${({ $isOpen }) => $isOpen ? 'rotate(45deg)' : 'rotate(0)'};
    }
    
    &:nth-child(2) {
      top: 9px;
      opacity: ${({ $isOpen }) => $isOpen ? '0' : '1'};
      width: ${({ $isOpen }) => $isOpen ? '0%' : '100%'};
      left: ${({ $isOpen }) => $isOpen ? '50%' : '0'};
    }
    
    &:nth-child(3) {
      top: ${({ $isOpen }) => $isOpen ? '9px' : '18px'};
      transform: ${({ $isOpen }) => $isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

// Componente styled para el estilo utilizando un data-attribute para el estado activo
const StyledNavLink = styled.div<{ $active: boolean }>`
  position: relative;
  padding: 0.75rem 0;
  color: ${({ $active }) => ($active ? '#2251ff' : '#333')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  text-decoration: none;
  font-size: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #2251ff; /* Actualizado al color McKinsey */
    transform: ${({ $active }) => ($active ? 'scaleX(1)' : 'scaleX(0)')};
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #2251ff;
    
    &::after {
      transform: scaleX(1);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.5rem 0;
    
    &::after {
      bottom: -5px;
    }
  }
`;

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children, onClick }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none' }} onClick={onClick}>
      <StyledNavLink $active={active}>
        {children}
      </StyledNavLink>
    </Link>
  );
};

const Main = styled.main`
  flex: 1;
  padding: 0;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
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
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  
  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  
  // Cerrar el menú cuando se hace clic fuera del menú en dispositivos móviles
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('nav') && !target.closest('button')) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoImg src={mcKinseyLogo} alt="McKinsey Logo" />
            <LogoText>Technical Interview</LogoText>
          </Logo>
          
          <HamburgerButton onClick={toggleMenu}>
            <HamburgerIcon $isOpen={isMenuOpen}>
              <span></span>
              <span></span>
              <span></span>
            </HamburgerIcon>
          </HamburgerButton>
          
          <Nav $isOpen={isMenuOpen}>
            <NavLink to="/" active={location.pathname === '/'} onClick={toggleMenu}>
              Home
            </NavLink>
            {interviewInProgress && (
              <>
                <NavLink to="/questions" active={location.pathname === '/questions'} onClick={toggleMenu}>
                  Questions
                </NavLink>
                {settings.role === 'developer' && (
                  <NavLink to="/code-correction" active={location.pathname === '/code-correction'} onClick={toggleMenu}>
                    Code Correction
                  </NavLink>
                )}
              </>
            )}
            {location.pathname === '/results' && (
              <NavLink to="/results" active={true} onClick={toggleMenu}>
                Results
              </NavLink>
            )}
          </Nav>
        </HeaderContent>
        <MobileMenuOverlay $isOpen={isMenuOpen} onClick={toggleMenu} />
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