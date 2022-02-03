import { Asset, NERVOS_NETWORK, utils } from '@force-bridge/commons';
import { Box, DialogContent, Typography } from '@mui/material';
import React from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { useDialog } from 'components/Dialog/index';
import { TransactionLink } from 'components/TransactionLink';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { formatAddress } from 'utils';
import { ApproveInfo } from 'views/Bridge/Ethereum/hooks/useAllowance';
import { EthWalletSigner } from 'xchain/eth/EthWalletSigner';

export interface ApproveInputValues {
  asset: Asset;
  addApprove: (approve: ApproveInfo) => void;
}

export function useApproveTransaction(): UseMutationResult<{ txId: string }, unknown, ApproveInputValues> {
  const { signer, direction, network } = ForceBridgeContainer.useContainer();

  const [openDialog, closeDialog] = useDialog();
  const onOpenDialog = (status: string, description: string) => {
    const fromNetwork = direction === BridgeDirection.In ? network : NERVOS_NETWORK;
    const title = status === 'success' ? 'Bridge Tx sent' : 'Tx failed';
    const dialogContent = (
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
    );
    openDialog({
      children: { title, dialogContent, closeDialog },
    });
  };
  return useMutation(
    ['approveTransaction'],
    async (input: ApproveInputValues) => {
      if (!signer) boom('signer is not load');

      const txId = await (signer as EthWalletSigner).approve(input.asset.ident);
      input.addApprove({ txId: txId.txId, network, user: signer.identityXChain(), assetIdent: input.asset.ident });
      return txId;
    },
    {
      onSuccess({ txId }) {
        onOpenDialog('success', txId);
      },
      onError(error) {
        const errorMsg: string = utils.hasProp(error, 'message') ? String(error.message) : 'Unknown error';
        onOpenDialog('fail', errorMsg);
      },
    },
  );
}
