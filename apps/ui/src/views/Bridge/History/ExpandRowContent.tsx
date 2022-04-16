import { BridgeTransactionStatus, TransactionSummaryWithStatus } from '@force-bridge/commons/lib/types/apiv1';
import { Typography } from '@mui/material';
import React from 'react';
import { RetryBurnButton } from './RetryBurnButton';
import { TransactionLink } from 'components/TransactionLink';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';

interface ExpandRowContentProps {
  record: TransactionSummaryWithStatus;
  xchainConfirmNumber?: number;
  nervosConfirmNumber?: number;
}

export const ExpandRowContent: React.FC<ExpandRowContentProps> = (props) => {
  const { record, xchainConfirmNumber, nervosConfirmNumber } = props;
  const { network } = ForceBridgeContainer.useContainer();
  let confirmStatus;
  const confirmNumber = record.txSummary.fromAsset.network === 'Nervos' ? nervosConfirmNumber : xchainConfirmNumber;
  if (record.status === BridgeTransactionStatus.Successful) {
    confirmStatus = '';
  } else {
    confirmStatus =
      record.txSummary.fromTransaction.confirmStatus === 'confirmed' ||
      record.txSummary.fromTransaction.confirmStatus === 'pending'
        ? ` (${record.txSummary.fromTransaction.confirmStatus})`
        : ` (${record.txSummary.fromTransaction.confirmStatus.toString()}/${confirmNumber})`;
  }
  const fromTransactionDescription =
    (record.txSummary.fromAsset.network === 'Nervos' ? `1.burn asset on Nervos` : `1.lock asset on ${network}`) +
    confirmStatus;

  let toTransactionDescription =
    record.txSummary.toAsset.network === 'Nervos' ? `2.mint asset on Nervos` : `2.unlock asset on ${network}`;
  if (record.status === BridgeTransactionStatus.Failed) {
    toTransactionDescription = toTransactionDescription + ` (error: ${record.message})`;
  } else if (
    record.status === BridgeTransactionStatus.Pending &&
    record.txSummary.fromTransaction.confirmStatus === 'confirmed'
  ) {
    toTransactionDescription = toTransactionDescription + ' (pending)';
  }

  const isDisplayRetry =
    record.txSummary.fromTransaction.confirmStatus === 'pending' && record.txSummary.fromAsset.network === 'Nervos';
  const isDisplayToTransactionText =
    record.status === BridgeTransactionStatus.Failed ||
    (record.status === BridgeTransactionStatus.Pending &&
      record.txSummary.fromTransaction.confirmStatus === 'confirmed');

  return (
    <>
      <Typography variant="body2" color="text.primary">
        Bridge steps:
      </Typography>
      <TransactionLink
        color="text.primary"
        variant="body2"
        network={record.txSummary.fromAsset.network === 'Nervos' ? 'Nervos' : network}
        txId={record.txSummary.fromTransaction.txId}
      >
        {fromTransactionDescription}
      </TransactionLink>
      {isDisplayRetry && <RetryBurnButton burnTxId={record.txSummary.fromTransaction.txId} />}
      <Typography variant="body2" color="text.primary">
        {isDisplayToTransactionText && toTransactionDescription}
      </Typography>
      {record.status === BridgeTransactionStatus.Successful && record.txSummary?.toTransaction?.txId && (
        <TransactionLink
          color="text.primary"
          variant="body2"
          network={record.txSummary.toAsset.network === 'Nervos' ? 'Nervos' : network}
          txId={record.txSummary.toTransaction.txId}
        >
          {toTransactionDescription}
        </TransactionLink>
      )}
    </>
  );
};
