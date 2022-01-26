import { Asset, NERVOS_NETWORK, utils } from '@force-bridge/commons';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';
import { useDialog } from 'components/ConfirmMessage';
import { TransactionLink } from 'components/TransactionLink';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { useSentTransactionStorage } from 'hooks/useSentTransactionStorage';
import { formatAddress } from 'utils';

export interface BridgeInputValues {
  asset: Asset;
  recipient: string;
}

export function useSendBridgeTransaction(): UseMutationResult<{ txId: string }, unknown, BridgeInputValues> {
  const { api, signer, direction, network } = ForceBridgeContainer.useContainer();
  const { addTransaction } = useSentTransactionStorage();
  const history = useHistory();
  const location = useLocation();

  const setParams = (isBridge: string) => {
    const params = new URLSearchParams(location.search);
    params.set('isBridge', isBridge);
    history.replace({ search: params.toString() });
  };

  const [openDialog, closeDialog] = useDialog();
  const onOpenDialog = (status: string, description: string) => {
    const fromNetwork = direction === BridgeDirection.In ? network : NERVOS_NETWORK;
    openDialog({
      children: (
        <>
          <DialogTitle sx={{ textAlign: 'center' }}>
            {status === 'success' ? 'Bridge Tx sent' : 'Tx failed'}
          </DialogTitle>
          <DialogContent>
            <Box flexDirection="column" alignItems="center">
              {status === 'success' ? (
                <>
                  <Typography>The transaction has been sent, check it in</Typography>
                  <TransactionLink color="text.primary" variant="body1" network={fromNetwork} txId={description}>
                    explorer
                  </TransactionLink>
                  <Typography>transaction id: {formatAddress(description)}</Typography>
                </>
              ) : (
                <Typography>{description}</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => closeDialog()}>
              Close
            </Button>
          </DialogActions>
        </>
      ),
    });
  };

  return useMutation(
    ['sendTransaction'],
    async (input: BridgeInputValues) => {
      if (!signer) boom('signer is not load');
      let generated;
      let txToCache;
      if (direction === BridgeDirection.In) {
        // TODO refactor to life-time style? beforeTransactionSending / afterTransactionSending
        generated = await api.generateBridgeInNervosTransaction({
          asset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          recipient: input.recipient,
          sender: signer.identityXChain(),
        });
        txToCache = {
          txId: '',
          sender: signer.identityXChain(),
          timestamp: new Date().getTime(),
          fromAsset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          toAsset: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            network: input.asset!.shadow!.network,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ident: input.asset!.shadow!.ident,
            amount: input.asset.amount,
          },
          rawTx: generated.rawTransaction,
        };
      } else {
        generated = await api.generateBridgeOutNervosTransaction({
          network,
          amount: input.asset.amount,
          asset: input.asset.ident,
          recipient: input.recipient,
          sender: signer.identityNervos(),
        });
        txToCache = {
          txId: '',
          sender: signer.identityNervos(),
          timestamp: new Date().getTime(),
          toAsset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          fromAsset: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            network: input.asset!.shadow!.network,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ident: input.asset!.shadow!.ident,
            amount: input.asset.amount,
          },
          rawTx: generated.rawTransaction,
        };
      }

      const { txId } = await signer.sendTransaction(generated.rawTransaction);
      txToCache.txId = txId;
      addTransaction(txToCache);
      return { txId: txId };
    },
    {
      onSuccess({ txId }) {
        setParams('false');
        onOpenDialog('success', txId);
      },
      onError(error) {
        const errorMsg: string = utils.hasProp(error, 'message') ? String(error.message) : 'Unknown error';
        onOpenDialog('fail', errorMsg);
      },
    },
  );
}
