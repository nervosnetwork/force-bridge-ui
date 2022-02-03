import Container from '@mui/material/Container';
import React, { useEffect, useState } from 'react';
import { BridgeOperationForm } from './BridgeOperation';
import DialogProvider from 'components/Dialog/index';
import { Footer } from 'components/Footer';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { useSearchParams } from 'hooks/useSearchParams';
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

    api.getBridgeConfig().then(async (config) => {
      const ckbRpcUrl = process.env.REACT_APP_CKB_RPC_URL;

      const wallet = new EthereumWalletConnector({
        ckbRpcUrl: ckbRpcUrl,
        ckbChainID: ckbChainID,
        contractAddress: config.xchains.Ethereum.contractAddress,
        omniLockscriptHashType: config.nervos.omniLockHashType,
        omniLockscriptCodeHash: config.nervos.omniLockCodeHash,
      });
      setWallet(wallet);
      await wallet.init();

      setConfirmNumberConfig({
        xchainConfirmNumber: config.xchains.Ethereum.confirmNumber,
        nervosConfirmNumber: config.nervos.confirmNumber,
      });
    });

    return () => {
      setWallet(undefined);
    };
  }, [api, setWallet]);

  const searchParams = useSearchParams();
  const isBridge = searchParams.get('isBridge') === 'true';

  return (
    <DialogProvider>
      {wallet instanceof EthereumWalletConnector && (
        <Container maxWidth="sm">
          {isBridge && <BridgeOperationForm />}

          {!isBridge && (
            <BridgeHistory
              asset={selectedAsset}
              xchainConfirmNumber={confirmNumberConfig?.xchainConfirmNumber}
              nervosConfirmNumber={confirmNumberConfig?.nervosConfirmNumber}
            />
          )}
          <Footer />
        </Container>
      )}
    </DialogProvider>
  );
};

export default EthereumBridge;
