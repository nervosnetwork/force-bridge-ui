import { BridgeTransactionStatus } from '@force-bridge/commons/lib/types/apiv1';
import React from 'react';
import { TransactionWithKey } from './index';
import { TransactionLink } from 'components/TransactionLink';

interface ExpandRowContentProps {
  record: TransactionWithKey;
}

export const ExpandRowContent: React.FC<ExpandRowContentProps> = (props) => {
  const { record } = props;
  const finalizeNumber = process.env.REACT_APP_FINALIZED_NUMBER;
  let confirmStatus;
  if (record.status === BridgeTransactionStatus.Successful) {
    confirmStatus = '';
  } else {
    confirmStatus =
      record.txSummary.fromTransaction.confirmStatus === 'confirmed'
        ? ' (confirmed)'
        : ` (${record.txSummary.fromTransaction.confirmStatus.toString()}/${finalizeNumber})`;
  }
  const fromTransactionDescription =
    (record.txSummary.fromAsset.network === 'Nervos' ? '1. burn asset on ' : '1. lock asset on ') +
    record.txSummary.fromAsset.network +
    confirmStatus;

  let toTransactionDescription;
  if (record.txSummary?.toTransaction?.txId) {
    toTransactionDescription =
      (record.txSummary.toAsset.network === 'Nervos' ? '2. mint asset on ' : '2. unlock asset on ') +
      record.txSummary.toAsset.network;
  }
  return (
    <div>
      <div>
        <TransactionLink network={record.txSummary.fromAsset.network} txId={record.txSummary.fromTransaction.txId}>
          {fromTransactionDescription}
        </TransactionLink>
      </div>
      {record.txSummary?.toTransaction?.txId && (
        <div>
          <TransactionLink network={record.txSummary.toAsset.network} txId={record.txSummary.toTransaction.txId}>
            {toTransactionDescription}
          </TransactionLink>
        </div>
      )}
    </div>
  );
};
