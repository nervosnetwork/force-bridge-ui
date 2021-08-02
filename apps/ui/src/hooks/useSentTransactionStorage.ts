import { NetworkTypes, RequiredAsset } from '@force-bridge/commons';
import { BridgeTransactionStatus, TransactionSummaryWithStatus } from '@force-bridge/commons/lib/types/apiv1';
import { useLocalStorage } from '@rehooks/local-storage';
import { useCallback } from 'react';

export interface SentTransactionStorage<T extends NetworkTypes> {
  transactions: CachedTransaction<T>[] | null;
  addTransaction: (tx: AddTransactionPayload<T>) => void;
  removeTransactions: (txIds: string[]) => void;
  getTransactionByFromTxId: (txId: string) => CachedTransaction<T> | undefined;
  setTransaction: (txId: string, tx: CachedTransaction<T>) => void;
}

export type CachedTransaction<T extends NetworkTypes> = TransactionSummaryWithStatus & { sender: string } & {
  rawTx: T['RawTransaction'];
};

export interface AddTransactionPayload<T extends NetworkTypes> {
  txId: string;
  timestamp: number;
  sender: string;
  fromAsset: RequiredAsset<'amount'>;
  toAsset: RequiredAsset<'amount'>;
  rawTx: T['RawTransaction'];
}

export function useSentTransactionStorage<T extends NetworkTypes>(): SentTransactionStorage<T> {
  const [transactions, setTransactions] = useLocalStorage<CachedTransaction<T>[]>('SentTransactionStorage');
  const addTransaction = useCallback(
    (tx: AddTransactionPayload<T>) => {
      const cachedTx: CachedTransaction<T> = {
        status: BridgeTransactionStatus.Pending,
        sender: tx.sender,
        txSummary: {
          fromAsset: tx.fromAsset,
          toAsset: tx.toAsset,
          fromTransaction: { txId: tx.txId, timestamp: tx.timestamp, confirmStatus: 'pending' },
        },
        rawTx: tx.rawTx,
      };
      if (!transactions) {
        return setTransactions([cachedTx]);
      }
      setTransactions(transactions.concat(cachedTx));
    },
    [transactions, setTransactions],
  );
  const removeTransactions = useCallback(
    (txIds: string[]) => {
      if (!transactions || !txIds.length) return;
      const newTransactions = transactions.filter(
        (value) => !txIds.find((id) => id === value.txSummary.fromTransaction.txId),
      );
      setTransactions(newTransactions);
    },
    [transactions, setTransactions],
  );
  const getTransactionByFromTxId = useCallback(
    (txId: string) => {
      if (!transactions) return undefined;
      return transactions.find((value) => value.txSummary.fromTransaction.txId === txId);
    },
    [transactions],
  );
  const setTransaction = useCallback(
    (txId: string, tx: CachedTransaction<T>) => {
      if (!transactions) return;
      const newTransactions = transactions.map((value) => {
        if (value.txSummary.fromTransaction.txId === txId) return tx;
        return value;
      });
      setTransactions(newTransactions);
    },
    [transactions, setTransactions],
  );
  return {
    transactions: transactions,
    addTransaction: addTransaction,
    removeTransactions: removeTransactions,
    getTransactionByFromTxId,
    setTransaction,
  };
}
