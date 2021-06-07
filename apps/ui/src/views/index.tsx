import { NERVOS_NETWORK } from '@force-bridge/commons';
import { BigNumber } from 'bignumber.js';
import React, { useEffect } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AppHeader } from './Header';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { BridgeView } from 'views/Bridge';

BigNumber.set({ EXPONENTIAL_AT: 99 });

const MainWrapper = styled.div`
  padding-top: 96px;
  padding-bottom: 32px;
  min-height: 100vh;
  background: linear-gradient(111.44deg, #dcf2ed 0%, #d3d9ec 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AppView: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { network } = ForceBridgeContainer.useContainer();

  useEffect(() => {
    if (location.pathname === '/') history.replace(`/bridge/${network}/${NERVOS_NETWORK}`);
  }, [network, location.pathname, history]);

  return (
    <>
      <AppHeader />
      <MainWrapper>
        <Route path="/bridge/:fromNetwork/:toNetwork">
          <BridgeView />
        </Route>
      </MainWrapper>
    </>
  );
};
