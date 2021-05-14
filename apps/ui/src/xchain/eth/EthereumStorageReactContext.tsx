import { TransactionSummary } from '@force-bridge/commons/lib/types/apiv1';
import { useLocalStorage } from '@rehooks/local-storage';
import React, { createContext, useContext } from 'react';

export interface EthereumStorage {
  transactions: EthereumTransaction[] | null;
  addTransaction: (tx: EthereumTransaction) => void;
}

export interface EthereumTransaction {
  txHash: string;
  timestamp: string;
  status: 'Pending' | 'Failed' | 'Succeed';
  info: ApproveInfo | BridgeInfo;
}

export interface ApproveInfo {
  kind: 'approve';
  user: string;
  asset: string;
}

export interface BridgeInfo {
  kind: 'bridge';
  summary: TransactionSummary['txSummary'];
}

const EthereumStorageContext = createContext<EthereumStorage | null>(null);

export const EthereumStorageProvider: React.FC = (props) => {
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
  return <EthereumStorageContext.Provider value={ethereumStorage}>{props.children}</EthereumStorageContext.Provider>;
};

export function useEthereumStorage(): EthereumStorage | null {
  return useContext(EthereumStorageContext);
}
