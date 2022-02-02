import { Box, DialogContent, Link, Typography } from '@mui/material';
import { providers } from 'ethers';
import React from 'react';
import { createContainer } from 'unstated-next';
import { useDialog } from 'components/ConfirmMessage';

export const EthereumProviderContainer = createContainer<providers.Web3Provider>(() => {
  const ethereum = window.ethereum;
  const [openDialog, closeDialog] = useDialog();

  if (!ethereum) {
    const title = 'About';
    const dialogContent = (
      <DialogContent>
        <Box flexDirection="column" alignItems="center">
          <Link href="https://metamask.io/" target="_blank" rel="noreferrer" variant="body1">
            MetaMask
          </Link>
          <Typography>is required when doing the bridge of Ethereum</Typography>
        </Box>
      </DialogContent>
    );
    openDialog({
      children: { title, dialogContent, closeDialog },
    });

    throw new Error('Metamask is required');
  }

  return new providers.Web3Provider(ethereum);
});
