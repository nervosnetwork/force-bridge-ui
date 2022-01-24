import { Asset } from '@force-bridge/commons';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Box, Button, DialogActions, DialogContent, DialogProps, Divider, Grid, Typography } from '@mui/material';
import { AssetLogo } from 'components/AssetLogo';
import { TransferDetails } from 'components/TransferDetails';
import React from 'react';
import { CustomizedDialog } from './styled';

interface TransferDialogProps extends DialogProps {
  selectedAsset: Asset;
  submitForm(): void;
  onClose(): void;
}

export const TransferModal: React.FC<TransferDialogProps> = (props) => {
  const { selectedAsset, submitForm, onClose, ...modalProps } = props;
  // const { recipient } = BridgeOperationFormContainer.useContainer();

  return (
    <CustomizedDialog {...modalProps} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box>
        <AssetLogo network={selectedAsset.network} sx={{ width: 48, height: 48 }} />
      </Box>
      <DialogContent>
        <Typography color="primary.light" variant="h2">
          {selectedAsset.info?.name}
        </Typography>
        <ChevronDoubleRightIcon />
        <Typography color="primary.light" variant="h2">
          {selectedAsset.shadow?.info?.name}
        </Typography>
      </DialogContent>
      <TransferDetails selectedAsset={selectedAsset} />
      <DialogActions>
        <Button variant="contained" fullWidth onClick={() => onClose()}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" fullWidth onClick={() => submitForm()}>
          Confirm
        </Button>
      </DialogActions>
      {/* <Box>
        <LoadingAnimation src={load} />
      </Box>
      <DialogContent sx={{ flexDirection: 'column' }}>
        <Typography color="text.secondary" variant="h2">
          Transmitting
        </Typography>
        <Typography color="primary.light" variant="body1">
          {formatAddress(recipient)}
        </Typography>
      </DialogContent> */}
    </CustomizedDialog>
  );
};
