import { Asset } from '@force-bridge/commons';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Box, Button, DialogActions, DialogContent, DialogProps, Divider, Grid, Typography } from '@mui/material';
import { HumanizeAmount } from 'components/AssetAmount';
import { AssetLogo } from 'components/AssetLogo';
import { TransferDetails } from 'components/TransferDetails';
import { useBridgeFeeQuery } from 'hooks/bridge-operation';
import React from 'react';
import { CustomizedDialog, LoadingAnimation } from './styled';
import load from '../../assets/images/load.gif';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';

interface TransferDialogProps extends DialogProps {
  selectedAsset: Asset;
}

export const TransferModal: React.FC<TransferDialogProps> = (props) => {
  const { selectedAsset, ...modalProps } = props;
  const { recipient } = BridgeOperationFormContainer.useContainer();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
  };

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
        <Button variant="contained" fullWidth onClick={() => props.onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" fullWidth>
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
