import { providers } from 'ethers';
import React, { createContext, useContext } from 'react';

export interface ProviderProps {
  provider: providers.Provider;
}

const ProviderContext = createContext<ProviderProps | null>(null);

export const EthereumProviderProvider: React.FC<ProviderProps> = ({ children, provider }) => {
  return <ProviderContext.Provider value={{ provider }}>{children}</ProviderContext.Provider>;
};

export function useEthereumProvider(): providers.Provider {
  const context = useContext(ProviderContext);
  if (!context?.provider) throw new Error('useEthereumProvider must be wrapped in <EthereumProviderProvider>');

  return context.provider;
}
