import { NERVOS_NETWORK } from '@force-bridge/commons';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, useHistory, useLocation } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { AppHeader } from 'components/AppHeader';
import { ForceBridgeProvider, useForceBridge } from 'state';
import { defaultTheme } from 'theme';
import { BridgeView } from 'views';
import './App.less';

const AppViewWrapper = styled.div`
  padding-top: 96px;
  padding-bottom: 32px;
  min-height: 100vh;
  background: linear-gradient(111.44deg, #dcf2ed 0%, #d3d9ec 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AppView: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { network } = useForceBridge();

  useEffect(() => {
    if (location.pathname === '/') history.replace(`/bridge/${network}/${NERVOS_NETWORK}`);
  }, [network, location.pathname, history]);

  return (
    <AppViewWrapper>
      <Route path="/bridge/:fromNetwork/:toNetwork">
        <BridgeView />
      </Route>
    </AppViewWrapper>
  );
};

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={defaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ForceBridgeProvider>
            <AppHeader />
            <AppView />
          </ForceBridgeProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
