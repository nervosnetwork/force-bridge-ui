import { utils } from '@force-bridge/commons';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/inpage-provider';
import { useEffect, useState } from 'react';
import { useEthereumProvider } from '../EthereumProviderReactContext';

export function useChainId(): number | null {
  const [chainId, setChainId] = useState<number | null>(null);
  const provider = useEthereumProvider();

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
        (provider as MetaMaskInpageProvider).on('chainChanged', chainIdListener);
      }
    });

    return () => {
      inpageProvider?.off?.('chainChanged', chainIdListener);
    };
  }, [provider]);

  return chainId;
}
