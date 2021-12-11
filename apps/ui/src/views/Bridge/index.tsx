import { Skeleton } from 'antd';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BindNetworkDirectionWithRoute } from 'views/Bridge/BindNetworkDirectionWithRoute';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { NetworkDirectionSelector } from 'views/Header/NetworkDirectionSelector';

const EthereumBridge = lazy(async () => import('./Ethereum'));

export const BridgeView: React.FC = () => {
  // useBindRouteAndBridgeState();
  const {
    network,
    direction,
    switchBridgeDirection,
    switchNetwork,
    supportedNetworks,
  } = ForceBridgeContainer.useContainer();
  return (
    <BridgeOperationFormContainer.Provider>
      <BindNetworkDirectionWithRoute />
      <div style={{ maxWidth: '300px', margin: '0 auto' }}>
        <NetworkDirectionSelector
          networks={supportedNetworks}
          network={network}
          direction={direction}
          onSelect={({ network, direction }) => {
            switchNetwork(network);
            switchBridgeDirection(direction);
          }}
        />
      </div>
      <Suspense fallback={<Skeleton active />}>
        <Switch>
          <Route path={['/bridge/Ethereum/Nervos', '/bridge/Nervos/Ethereum']} component={EthereumBridge} />
        </Switch>
      </Suspense>
    </BridgeOperationFormContainer.Provider>
  );
};
