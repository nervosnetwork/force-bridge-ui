import React, { useEffect, useState } from 'react';
import { BridgeOperationForm } from './BridgeOperation';
import { ChainIdWarning } from './ChainIdWarning';
import { EthereumProviderContainer } from 'containers/EthereumProviderContainer';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { BridgeHistory } from 'views/Bridge/components/BridgeHistory';
import { useSelectBridgeAsset } from 'views/Bridge/hooks/useSelectBridgeAsset';
import { ConnectorConfig, EthereumWalletConnector } from 'xchain';

function checkChainId(chainId: number): asserts chainId is ConnectorConfig['ckbChainID'] {
  if (chainId !== 0 && chainId !== 1 && chainId !== 2) {
    throw new Error(`${chainId} is not a valid CKB Chain Id`);
  }
}

const EthereumBridge: React.FC = () => {
  const { selectedAsset } = useSelectBridgeAsset();
  const { setWallet, api, wallet } = ForceBridgeContainer.useContainer();
  const [confirmNumberConfig, setConfirmNumberConfig] = useState<{
    xchainConfirmNumber: number;
    nervosConfirmNumber: number;
  }>();

  useEffect(() => {
    // TODO fetch the CKBChainID from the RPC
    const ckbChainID = Number(process.env.REACT_APP_CKB_CHAIN_ID);

    checkChainId(ckbChainID);

    api.getBridgeConfig().then((config) => {
      setWallet(
        new EthereumWalletConnector({
          ckbRpcUrl: process.env.REACT_APP_CKB_RPC_URL,
          ckbChainID,
          contractAddress: config.xchains.Ethereum.contractAddress,
        }),
      );
      setConfirmNumberConfig({
        xchainConfirmNumber: config.xchains.Ethereum.confirmNumber,
        nervosConfirmNumber: config.nervos.confirmNumber,
      });
    });

    return () => {
      setWallet(undefined);
    };
  }, [api, setWallet]);

  return (
    <EthereumProviderContainer.Provider>
      <ChainIdWarning
        chainId={Number(process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_ID)}
        chainName={process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME}
      />
      {wallet instanceof EthereumWalletConnector && (
        <div>
          <BridgeOperationForm />
          <div style={{ padding: '8px' }} />
          {selectedAsset && confirmNumberConfig && (
            <BridgeHistory
              asset={selectedAsset}
              xchainConfirmNumber={confirmNumberConfig.xchainConfirmNumber}
              nervosConfirmNumber={confirmNumberConfig.nervosConfirmNumber}
            />
          )}
        </div>
      )}
    </EthereumProviderContainer.Provider>
  );
};

export default EthereumBridge;
