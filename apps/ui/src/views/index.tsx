import { NERVOS_NETWORK } from '@force-bridge/commons';
import { Container } from '@mui/material';
import { BigNumber } from 'bignumber.js';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AppHeader } from './Header';
import { AppContainer } from './styled';
import DialogProvider from 'components/Dialog';
import { Footer } from 'components/Footer';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { EthereumProviderContainer } from 'containers/EthereumProviderContainer';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { BridgeView } from 'views/Bridge';

BigNumber.set({ EXPONENTIAL_AT: 99 });

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
      <AppContainer>
        <BridgeOperationFormContainer.Provider>
          <EthereumProviderContainer.Provider>
            <DialogProvider>
              <Container maxWidth="sm">
                <BridgeView />
                <Footer />
              </Container>
            </DialogProvider>
          </EthereumProviderContainer.Provider>
        </BridgeOperationFormContainer.Provider>
      </AppContainer>
    </>
  );
};
