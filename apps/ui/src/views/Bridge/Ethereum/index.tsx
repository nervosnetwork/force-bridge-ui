import PWCore, { CHAIN_SPECS, ChainID, EthProvider, PwCollector } from '@lay2/pw-core';
import React, { useEffect, useState } from 'react';
import { BridgeOperationForm } from './BridgeOperation';
import { ChainIdWarning } from './ChainIdWarning';
import { useChainId } from './hooks/useChainId';
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
  const chainId = useChainId();
  const { selectedAsset } = useSelectBridgeAsset();
  const { setWallet, api, wallet, network } = ForceBridgeContainer.useContainer();
  const [confirmNumberConfig, setConfirmNumberConfig] = useState<{
    xchainConfirmNumber: number;
    nervosConfirmNumber: number;
  }>();

  useEffect(() => {
    // TODO fetch the CKBChainID from the RPC
    const ckbChainID = Number(process.env.REACT_APP_CKB_CHAIN_ID);
    checkChainId(ckbChainID);

    api.getBridgeConfig().then(async (config) => {
      const ckbRpcUrl = process.env.REACT_APP_CKB_RPC_URL;
      const pwChainId = ckbChainID === 0 ? ChainID.ckb : ChainID.ckb_testnet;

      const wallet = new EthereumWalletConnector({
        ckbRpcUrl: ckbRpcUrl,
        ckbChainID: pwChainId,
        contractAddress: config.xchains.Ethereum.contractAddress,
      });

      setWallet(wallet);

      await new PWCore(ckbRpcUrl).init(
        new EthProvider(),
        new PwCollector(ckbRpcUrl),
        // FIXME pw-lock has a bug here, remove the type convert after pw-core upgrade to 0.4.x
        (String(pwChainId) as unknown) as ChainID,
        [CHAIN_SPECS.Lina, CHAIN_SPECS.Aggron][ckbChainID],
      );

      // FIXME remove me when pw-core upgrade to 0.4.x
      PWCore.chainId = ckbChainID;
      await wallet.init();

      setConfirmNumberConfig({
        xchainConfirmNumber: config.xchains.Ethereum.confirmNumber,
        nervosConfirmNumber: config.nervos.confirmNumber,
      });
    });

    return () => {
      setWallet(undefined);
    };
  }, [api, setWallet, chainId]);

  return (
    <>
      <ChainIdWarning
        chainId={
          network === 'Ethereum'
            ? Number(process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_ID)
            : Number(process.env.REACT_APP_BSC_ENABLE_CHAIN_ID)
        }
        chainName={
          network === 'Ethereum'
            ? process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME
            : process.env.REACT_APP_BSC_ENABLE_CHAIN_NAME
        }
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
    </>
  );
};

export default EthereumBridge;
