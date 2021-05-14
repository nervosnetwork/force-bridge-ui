import { RequiredAsset } from '@force-bridge/commons';
import { BridgeTransactionStatus, TransactionSummaryWithStatus } from '@force-bridge/commons/lib/types/apiv1';
import { useLocalStorage } from '@rehooks/local-storage';
import React, { createContext, useContext } from 'react';

export interface EthereumStorage {
  transactions: TransactionSummaryWithStatus[] | null;
  addTransaction: (tx: EthereumTransaction) => void;
}

export interface EthereumTransaction {
  txId: string;
  timestamp: number;
  fromAsset: RequiredAsset<'amount'>;
  toAsset: RequiredAsset<'amount'>;
}

const EthereumStorageContext = createContext<EthereumStorage | null>(null);

export const EthereumStorageProvider: React.FC = (props) => {
  const [transactions, setTransactions] = useLocalStorage<TransactionSummaryWithStatus[]>('EthereumStorage');
  const addTransaction = (tx: EthereumTransaction) => {
    const txSummary: TransactionSummaryWithStatus = {
      status: BridgeTransactionStatus.Pending,
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
