import { NERVOS_NETWORK } from '@force-bridge/commons';
import { BigNumber } from 'bignumber.js';
import React, { useEffect } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import { AppHeader } from './Header';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { BridgeView } from 'views/Bridge';
import { AppContainer } from './styled';

BigNumber.set({ EXPONENTIAL_AT: 99 });

export const AppView: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { network } = ForceBridgeContainer.useContainer();

  useEffect(() => {
    if (location.pathname === '/') history.replace(`/bridge/${network}/${NERVOS_NETWORK}?isBridge=true`);
  }, [network, location.pathname, history]);

  return (
    <>
      <AppHeader />
      <AppContainer>
        <Route path="/bridge/:fromNetwork/:toNetwork">
          <BridgeView />
        </Route>
      </AppContainer>
    </>
  );
};
