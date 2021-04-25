import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';
import { AppHeader } from 'components/AppHeader';
import { ForceBridgeProvider } from 'state';
import { defaultTheme } from 'theme';
import { AppView } from 'views';
import './App.less';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={defaultTheme}>
      <QueryClientProvider client={queryClient}>
        <ForceBridgeProvider>
          <AppHeader />
          <AppView />
        </ForceBridgeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
