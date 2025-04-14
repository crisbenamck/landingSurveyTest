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
  height: 84px; /* Aumentado en 20% de 70px */

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
  height: 48px; /* Aumentado a 48px como solicitado */
  width: auto;
`;

const LogoText = styled.span`
  color: #002373; /* McKinsey blue */
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  font-family: 'Bower', 'Times New Roman', Times, serif;
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

// Nueva estructura principal con diseño de columnas
const MainContainer = styled.div`
  display: flex;
  flex: 1;
  background-color: #ffffff;
`;

// Barra lateral izquierda para el menú
const Sidebar = styled.div<{ $isOpen: boolean }>`
  width: 250px;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 2rem 1rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 84px; /* Actualizado para coincidir con el nuevo header height */
    left: 0;
    height: calc(100vh - 84px); /* Actualizado para coincidir con el nuevo header height */
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s ease-in-out;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 84px; /* Actualizado para coincidir con el nuevo header height */
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`;

// Componente styled para el estilo utilizando un data-attribute para el estado activo
const StyledNavLink = styled.div<{ $active: boolean }>`
  position: relative;
  padding: 0.75rem 1rem;
  color: ${({ $active }) => ($active ? '#2251ff' : '#333')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  text-decoration: none;
  font-size: 1rem;
  border-radius: 4px;
  background-color: ${({ $active }) => ($active ? 'rgba(34, 81, 255, 0.1)' : 'transparent')};
  
  &:hover {
    color: #2251ff;
    background-color: rgba(34, 81, 255, 0.05);
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
  color: #555555;
  font-size: 0.875rem;
  border-top: 1px solid #e9ecef;
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
        </HeaderContent>
        <MobileMenuOverlay $isOpen={isMenuOpen} onClick={toggleMenu} />
      </Header>
      
      <MainContainer>
        <Sidebar $isOpen={isMenuOpen}>
          <Nav>
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
        </Sidebar>
        
        <Main>
          <ContentWrapper>
            {children}
          </ContentWrapper>
        </Main>
      </MainContainer>
      
      <Footer>
        © {new Date().getFullYear()} Technical Interview - Evaluation System for Developers
      </Footer>
    </LayoutContainer>
  );
};

export default Layout;