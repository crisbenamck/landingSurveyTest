import 'styled-components';
import { theme } from '@styles/theme';

// Define the theme type
type ThemeType = typeof theme;

// Extend the styled-components DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
