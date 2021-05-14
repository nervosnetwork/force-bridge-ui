import { RequiredAsset } from '@force-bridge/commons';
import { BridgeTransactionStatus, UnFailedTransactionSummary } from '@force-bridge/commons/lib/types/apiv1';
import { useLocalStorage } from '@rehooks/local-storage';
import React, { createContext, useContext } from 'react';

export interface EthereumStorage {
  transactions: TransactionSummaryWithSender[] | null;
  addTransaction: (tx: EthereumTransaction) => void;
}

export type TransactionSummaryWithSender = UnFailedTransactionSummary & { sender: string };

export interface EthereumTransaction {
  txId: string;
  timestamp: number;
  sender: string;
  fromAsset: RequiredAsset<'amount'>;
  toAsset: RequiredAsset<'amount'>;
}

const EthereumStorageContext = createContext<EthereumStorage | null>(null);

export const EthereumStorageProvider: React.FC = (props) => {
  const [transactions, setTransactions] = useLocalStorage<TransactionSummaryWithSender[]>('EthereumStorage');
  const addTransaction = (tx: EthereumTransaction) => {
    const txSummary: TransactionSummaryWithSender = {
      status: BridgeTransactionStatus.Pending,
      sender: tx.sender,
      txSummary: {
        fromAsset: tx.fromAsset,
        toAsset: tx.toAsset,
        fromTransaction: { txId: tx.txId, timestamp: tx.timestamp },
      },
    };
    if (!transactions) {
      return setTransactions([txSummary]);
    }
    transactions.push(txSummary);
    setTransactions(transactions);
  };
  const ethereumStorage: EthereumStorage = {
    transactions,
    addTransaction,
  };
  return <EthereumStorageContext.Provider value={ethereumStorage}>{props.children}</EthereumStorageContext.Provider>;
};

export function useEthereumStorage(): EthereumStorage {
  const context = useContext(EthereumStorageContext);
  if (!context)
    throw new Error('useEthereumStorage must be used in component which wrapped by <EthereumStorageProvider>');
  return context;
}
