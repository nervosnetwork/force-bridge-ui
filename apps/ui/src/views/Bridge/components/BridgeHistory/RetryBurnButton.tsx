import { NERVOS_NETWORK, utils } from '@force-bridge/commons';
import { Button, ButtonProps, Modal } from 'antd';
import React from 'react';
import { useMutation } from 'react-query';
import { TransactionLink } from 'components/TransactionLink';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { useSentTransactionStorage } from 'hooks/useSentTransactionStorage';

export interface RetryBurnButtonProps extends ButtonProps {
  burnTxId: string;
}

export const RetryBurnButton: React.FC<RetryBurnButtonProps> = (props) => {
  const { signer } = ForceBridgeContainer.useContainer();
  const { getTransactionByFromTxId, removeTransactions, setTransaction } = useSentTransactionStorage();
  const { burnTxId } = props;

  const cachedBurnTx = getTransactionByFromTxId(burnTxId);

  const mutation = useMutation(
    ['retryBurn'],
    async () => {
      if (!signer) boom('signer is not load');
      if (!cachedBurnTx) boom('can not find cached burn tx');
      const { txId } = await signer.sendTransaction(cachedBurnTx.rawTx);
      return { txId: txId };
    },
    {
      onSuccess({ txId }) {
        Modal.success({
          title: 'Retry burn tx sent',
          content: (
            <p>
              The transaction has been sent, check it in&nbsp;
              <TransactionLink network={NERVOS_NETWORK} txId={txId}>
                explorer
              </TransactionLink>
              <details>
                <summary>transaction id</summary>
                {txId}
              </details>
            </p>
          ),
          onOk: () => {
            if (!cachedBurnTx) boom('can not find cached burn tx');
            cachedBurnTx.txSummary.fromTransaction.txId = txId;
            cachedBurnTx.txSummary.fromTransaction.timestamp = new Date().getTime();
            setTransaction(burnTxId, cachedBurnTx);
          },
        });
      },
      onError(error) {
        const errorMsg: string = utils.hasProp(error, 'message') ? String(error.message) : 'Unknown error';
        if (errorMsg.includes('"code":-301')) {
          Modal.error({
            title: 'Retry burn tx failed',
            content: (
              <p>
                The original tx may either be committed or conflicted. If committed, the related record will show up
                soon, otherwise you may fire up a new one (
                <TransactionLink network={NERVOS_NETWORK} txId={burnTxId}>
                  should checkout status first
                </TransactionLink>
                ).
                <details>
                  <summary>Details</summary>
                  Failed to resolve tx inputs.
                </details>
              </p>
            ),
            okText: 'OK',
            width: 360,
            onOk: () => removeTransactions([burnTxId]),
          });
        } else if (errorMsg.includes('"code":-1107')) {
          Modal.error({
            title: 'Retry burn tx failed',
            content: (
              <p>
                Please wait for tx committed.
                <details>
                  <summary>Details</summary>
                  Tx already exist in transaction pool.
                </details>
              </p>
            ),
            width: 360,
          });
        } else {
          Modal.error({ title: 'Retry burn tx failed', content: errorMsg, width: 360 });
        }
      },
    },
  );

  const onClick = () => mutation.mutate();

  return (
    <Button size="small" onClick={onClick} loading={mutation.isLoading}>
      retry
    </Button>
  );
};
