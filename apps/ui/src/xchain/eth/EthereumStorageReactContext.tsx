import { useLocalStorage } from '@rehooks/local-storage';
import React, { createContext, useContext } from 'react';

export interface EthereumStorage {
  transactions: EthereumTransaction[] | null;
  addTransaction: (tx: EthereumTransaction) => void;
}

export interface EthereumTransaction {
  txHash: string;
}

const EthereumStorageContext = createContext<EthereumStorage | null>(null);

export const EthereumProviderProvider: React.FC<EthereumStorage> = ({ children }) => {
  // eslint-disable-next-line prefer-const
  let [transactions, setTransactions] = useLocalStorage<EthereumTransaction[]>('EthereumStorage');
  const addTransaction = (tx: EthereumTransaction) => {
    if (transactions) {
      transactions.push(tx);
    } else {
      transactions = [tx];
    }
    setTransactions(transactions);
  };
  const ethereumStorage: EthereumStorage = {
    transactions,
    addTransaction,
  };
  return <EthereumStorageContext.Provider value={ethereumStorage}>{children}</EthereumStorageContext.Provider>;
};

export function useEthereumStorage(): EthereumStorage | null {
  return useContext(EthereumStorageContext);
}
