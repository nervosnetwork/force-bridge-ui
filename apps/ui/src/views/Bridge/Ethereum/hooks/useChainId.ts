import { utils } from '@force-bridge/commons';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/inpage-provider';
import { useEffect, useState } from 'react';
import { EthereumProviderContainer } from 'containers/EthereumProviderContainer';

export function useChainId(): number | null {
  const [chainId, setChainId] = useState<number | null>(null);
  const provider = EthereumProviderContainer.useContainer();

  useEffect(() => {
    provider.getNetwork().then((network) => setChainId(network.chainId));

    let inpageProvider: MetaMaskInpageProvider | undefined;

    function chainIdListener(changedChainId: unknown) {
      const chainId = Number(changedChainId);
      if (isNaN(chainId)) return;
      setChainId(chainId);
    }

    detectEthereumProvider().then((provider) => {
      if (utils.propEq(provider, 'isMetaMask', true)) {
        inpageProvider = provider as MetaMaskInpageProvider;
        inpageProvider.on('chainChanged', chainIdListener);
      }
    });

    return () => {
      inpageProvider?.off?.('chainChanged', chainIdListener);
    };
  }, [provider]);

  return chainId;
}
