import { Skeleton } from 'antd';
import React, { Suspense, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import EthereumBridge from './Ethereum';
import { BridgeHistory } from './History';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { BindNetworkDirectionWithRoute } from 'views/Bridge/BindNetworkDirectionWithRoute';
import { ConnectorConfig, EthereumWalletConnector } from 'xchain';

function checkChainId(chainId: number): asserts chainId is ConnectorConfig['ckbChainID'] {
  if (chainId !== 0 && chainId !== 1 && chainId !== 2) {
    throw new Error(`${chainId} is not a valid CKB Chain Id`);
  }
}

export const BridgeView: React.FC = () => {
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

  return (
    <>
      <BindNetworkDirectionWithRoute />
      <Suspense fallback={<Skeleton active />}>
        {wallet instanceof EthereumWalletConnector && (
          <Switch>
            <Route
              path={['/bridge/Ethereum/Nervos', '/bridge/Nervos/Ethereum', '/bridge/Bsc/Nervos', '/bridge/Nervos/Bsc']}
              component={EthereumBridge}
            />
            <Route path="/history">
              <BridgeHistory
                xchainConfirmNumber={confirmNumberConfig?.xchainConfirmNumber}
                nervosConfirmNumber={confirmNumberConfig?.nervosConfirmNumber}
              />
            </Route>
          </Switch>
        )}
      </Suspense>
    </>
  );
};
