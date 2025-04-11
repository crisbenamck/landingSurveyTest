export const theme = {
  colors: {
    primary: {
      main: '#003d7d', // Azul McKinsey
      light: '#3366a5',
      dark: '#002c59',
    },
    secondary: {
      main: '#042f5b', // Azul oscuro McKinsey
      light: '#204775',
      dark: '#021d3b',
    },
    success: {
      main: '#007a78', // Verde McKinsey
      light: '#34968e',
      dark: '#005452',
    },
    error: {
      main: '#c82333',
      light: '#e74c3c',
      dark: '#a71d2a',
    },
    warning: {
      main: '#ffc107',
      light: '#ffcd39',
      dark: '#e0a800',
    },
    grey: {
      100: '#f8f9fa',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529',
    },
    background: {
      default: '#ffffff', // Fondo blanco limpio como en McKinsey
      paper: '#ffffff',
      dark: '#f5f5f5',
    },
    text: {
      primary: '#333333', // Texto principal oscuro
      secondary: '#555555',
      disabled: '#adb5bd',
      light: '#f8f9fa',
    },
  },
  spacing: (factor: number) => `${factor * 8}px`,
  borderRadius: {
    sm: '0px', // McKinsey usa bordes más rectos
    md: '2px',
    lg: '4px',
    xl: '6px',
    pill: '9999px',
  },
  shadows: {
    sm: 'none', // Reducir o eliminar sombras para un look más plano
    md: '0 2px 4px rgba(0,0,0,0.05)',
    lg: '0 4px 6px rgba(0,0,0,0.05)',
    xl: '0 6px 8px rgba(0,0,0,0.05)',
  },
  typography: {
    fontFamily: "'Poppins', 'Helvetica Neue', Arial, sans-serif", // McKinsey suele usar fuentes sans-serif limpias
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
};