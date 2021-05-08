import { providers } from 'ethers';
import React from 'react';
import { EthereumProviderProvider } from './eth';
import { ChainIdWarning } from './eth/components/ChainIdWarning';
import { useForceBridge } from 'state';

// TODO multi ethereum provider, e.g. WalletConnectProvider
const EthereumEntry: React.FC = ({ children }) => {
  const ethereum = window.ethereum;
  if (!ethereum) return null;

  const provider = new providers.Web3Provider(ethereum);
  return (
    <EthereumProviderProvider provider={provider}>
      <ChainIdWarning
        chainId={Number(process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_ID)}
        chainName={process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME}
      />
      {children}
    </EthereumProviderProvider>
  );
};

export const XChainEntry: React.FC = ({ children }) => {
  const { network } = useForceBridge();

  if (network === 'Ethereum') return <EthereumEntry>{children}</EthereumEntry>;

  return null;
};
