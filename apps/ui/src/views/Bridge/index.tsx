import { Skeleton } from 'antd';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { BridgeOperationContainer } from './containers/BridgeOperationContainer';
import { useBindRouteAndBridgeState } from './hooks/useBindRouteAndBridgeState';
import { StyledCardWrapper } from 'components/Styled';

const EthereumBridge = lazy(async () => import('./Ethereum'));

export const BridgeView: React.FC = () => {
  useBindRouteAndBridgeState();

  return (
    <BridgeOperationContainer.Provider>
      <Suspense
        fallback={
          <StyledCardWrapper>
            <Skeleton active />
          </StyledCardWrapper>
        }
      >
        <Switch>
          <Route path={['/bridge/Ethereum/Nervos', '/bridge/Nervos/Ethereum']} component={EthereumBridge} />
        </Switch>
      </Suspense>
    </BridgeOperationContainer.Provider>
  );
};
