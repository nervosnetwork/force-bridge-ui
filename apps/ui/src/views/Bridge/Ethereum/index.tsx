import PWCore, {
  CellDep,
  CHAIN_SPECS,
  ChainID,
  DepType,
  EthProvider,
  HashType,
  OutPoint,
  PwCollector,
  Script,
} from '@lay2/pw-core';
import React, { useEffect, useState } from 'react';
import { BridgeOperationForm } from './BridgeOperation';
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
      const pwChainId = (() => {
        switch (ckbChainID) {
          case 0:
            return ChainID.ckb;
          case 1:
            return ChainID.ckb_testnet;
          case 2:
            return ChainID.ckb_dev;
        }
      })();

      const wallet = new EthereumWalletConnector({
        ckbRpcUrl: ckbRpcUrl,
        ckbChainID: pwChainId,
        contractAddress: config.xchains.Ethereum.contractAddress,
        omniLockscriptHashType: config.nervos.omniLockHashType,
        omniLockscriptCodeHash: config.nervos.omniLockCodeHash,
      });

      setWallet(wallet);

      const getDevConfig = () => {
        const devConfig = CHAIN_SPECS.Aggron;
        devConfig.pwLock = {
          cellDep: new CellDep(
            process.env.REACT_APP_PWLOCK_DEP_TYPE === 'code' ? DepType.code : DepType.depGroup,
            new OutPoint(process.env.REACT_APP_PWLOCK_OUTPOINT_TXHASH, process.env.REACT_APP_PWLOCK_OUTPOINT_INDEX),
          ),
          script: new Script(
            process.env.REACT_APP_PWLOCK_CODE_HASH,
            '0x',
            process.env.REACT_APP_PWLOCK_HASH_TYPE === 'type' ? HashType.type : HashType.data,
          ),
        };
        return devConfig;
      };

      const pwConfig = ckbChainID === 2 ? getDevConfig() : [CHAIN_SPECS.Lina, CHAIN_SPECS.Aggron][ckbChainID];

      await new PWCore(ckbRpcUrl).init(
        new EthProvider(),
        new PwCollector(ckbRpcUrl),
        // FIXME pw-lock has a bug here, remove the type convert after pw-core upgrade to 0.4.x
        (String(pwChainId) as unknown) as ChainID,
        pwConfig,
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
      {/*<ChainIdWarning*/}
      {/*  chainId={*/}
      {/*    network === 'Ethereum'*/}
      {/*      ? Number(process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_ID)*/}
      {/*      : Number(process.env.REACT_APP_BSC_ENABLE_CHAIN_ID)*/}
      {/*  }*/}
      {/*  chainName={*/}
      {/*    network === 'Ethereum'*/}
      {/*      ? process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME*/}
      {/*      : process.env.REACT_APP_BSC_ENABLE_CHAIN_NAME*/}
      {/*  }*/}
      {/*/>*/}

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
