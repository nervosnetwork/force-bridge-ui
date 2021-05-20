import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { defaultTheme } from 'theme';
import { AppView } from 'views';
import './App.less';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={defaultTheme}>
      <QueryClientProvider client={queryClient}>
        <ForceBridgeContainer.Provider>
          <Router>
            <AppView />
          </Router>
        </ForceBridgeContainer.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
