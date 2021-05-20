import React from 'react';
import { BridgeOperationForm } from './BridgeOperation';
import { ChainIdWarning } from './ChainIdWarning';
import { EthereumProviderContainer } from 'containers/EthereumProviderContainer';
import { BridgeHistory } from 'views/Bridge/components/BridgeHistory';
import { useSelectBridgeAsset } from 'views/Bridge/hooks/useSelectBridgeAsset';

const EthereumBridge: React.FC = () => {
  const { selectedAsset } = useSelectBridgeAsset();

  return (
    <EthereumProviderContainer.Provider>
      <ChainIdWarning
        chainId={Number(process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_ID)}
        chainName={process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME}
      />
      <div>
        <BridgeOperationForm />
        <div style={{ padding: '8px' }} />
        {selectedAsset && <BridgeHistory asset={selectedAsset} />}
      </div>
    </EthereumProviderContainer.Provider>
  );
};

export default EthereumBridge;
