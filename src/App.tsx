import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// Pages
import ConfigPage from '@pages/ConfigPage';
import QuestionsPage from '@pages/QuestionsPage';
import CodeCorrectionPage from '@pages/CodeCorrectionPage';
import ResultsPage from '@pages/ResultsPage';

// Theme
import { theme } from '@styles/theme';

// Context
import { InterviewProvider } from '@hooks/useInterviewContext';

// Layout
import Layout from '@components/Layout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <InterviewProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ConfigPage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route path="/code-correction" element={<CodeCorrectionPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </Layout>
        </Router>
      </InterviewProvider>
    </ThemeProvider>
  );
}

export default App;