import { NERVOS_NETWORK, utils } from '@force-bridge/commons';
import { Box, Button, DialogContent, Typography } from '@mui/material';
import { ButtonProps } from 'antd';
import React from 'react';
import { useMutation } from 'react-query';
import { useDialog } from 'components/Dialog/index';
import { TransactionLink } from 'components/TransactionLink';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { useSentTransactionStorage } from 'hooks/useSentTransactionStorage';
import { formatAddress } from 'utils';

export interface RetryBurnButtonProps extends ButtonProps {
  burnTxId: string;
}

export const RetryBurnButton: React.FC<RetryBurnButtonProps> = (props) => {
  const { signer } = ForceBridgeContainer.useContainer();
  const { getTransactionByFromTxId, removeTransactions, setTransaction } = useSentTransactionStorage();
  const { burnTxId } = props;

  const cachedBurnTx = getTransactionByFromTxId(burnTxId);

  const [openDialog, closeDialog] = useDialog();
  const onOpenDialog = (title: string, dialogContent: React.ReactNode, onOk?: () => void) => {
    openDialog({
      children: { title, dialogContent, closeDialog, onOk },
    });
  };

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
        const dialogContent = (
          <DialogContent>
            <Box flexDirection="column" alignItems="center">
              <Typography>The transaction has been sent, check it in</Typography>
              <TransactionLink color="text.primary" variant="body1" network={NERVOS_NETWORK} txId={txId}>
                explorer
              </TransactionLink>
              <Typography>transaction id: {formatAddress(txId)}</Typography>
            </Box>
          </DialogContent>
        );
        const onOk = () => {
          if (!cachedBurnTx) boom('can not find cached burn tx');
          cachedBurnTx.txSummary.fromTransaction.txId = txId;
          cachedBurnTx.txSummary.fromTransaction.timestamp = new Date().getTime();
          setTransaction(burnTxId, cachedBurnTx);
        };

        onOpenDialog('Retry burn tx sent', dialogContent, onOk);
      },
      onError(error) {
        const errorMsg: string = utils.hasProp(error, 'message') ? String(error.message) : 'Unknown error';
        if (errorMsg.includes('"code":-301')) {
          const dialogContent = (
            <DialogContent>
              <Box flexDirection="column" alignItems="center">
                <Typography>
                  The original tx may either be committed or conflicted. If committed, the related record will show up
                  soon, otherwise you may fire up a new one
                </Typography>
                <TransactionLink color="text.primary" variant="body1" network={NERVOS_NETWORK} txId={burnTxId}>
                  explorer
                </TransactionLink>
                <Typography>Failed to resolve tx inputs.</Typography>
              </Box>
            </DialogContent>
          );
          const onOk = () => {
            removeTransactions([burnTxId]);
          };
          onOpenDialog('Retry burn tx failed', dialogContent, onOk);
        } else if (errorMsg.includes('"code":-1107')) {
          const dialogContent = (
            <DialogContent>
              <Box flexDirection="column" alignItems="center">
                <Typography>Please wait for tx committed.</Typography>
                <Typography>Tx already exist in transaction pool.</Typography>
              </Box>
            </DialogContent>
          );
          onOpenDialog('Retry burn tx failed', dialogContent);
        } else {
          const dialogContent = (
            <DialogContent>
              <Box flexDirection="column" alignItems="center">
                <Typography>{errorMsg}</Typography>
              </Box>
            </DialogContent>
          );
          onOpenDialog('Retry burn tx failed', dialogContent);
        }
      },
    },
  );

  const onClick = () => mutation.mutate();

  return (
    <Button size="small" color="primary" variant="contained" onClick={onClick}>
      retry
    </Button>
  );
};
