import { Asset } from '@force-bridge/commons';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Box, Button, DialogActions, DialogContent, DialogProps, Typography } from '@mui/material';
import React from 'react';
import load from '../../assets/images/load.gif';
import { CustomizedDialog, LoadingAnimation } from './styled';
import { AssetLogo } from 'components/AssetLogo';
import { TransferDetails } from 'components/TransferDetails';

interface TransferDialogProps extends DialogProps {
  recipient: string;
  loadingDialog: boolean;
  selectedAsset: Asset;
  submitForm(): void;
  onClose(): void;
}

export const TransferModal: React.FC<TransferDialogProps> = (props) => {
  const { recipient, loadingDialog, selectedAsset, submitForm, onClose, ...modalProps } = props;

  const formatAddress = (address: string) => {
    return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
  };

  return (
    <CustomizedDialog
      {...modalProps}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {loadingDialog ? (
        <>
          <Box>
            <LoadingAnimation src={load} />
          </Box>
          <DialogContent sx={{ flexDirection: 'column' }}>
            <Typography color="text.secondary" variant="h2">
              Transmitting
            </Typography>
            <Typography color="primary.light" variant="body1">
              {formatAddress(recipient)}
            </Typography>
          </DialogContent>
        </>
      ) : (
        <>
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
        </>
      )}
    </CustomizedDialog>
  );
};
