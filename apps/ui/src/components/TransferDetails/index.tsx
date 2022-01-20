import { Asset } from '@force-bridge/commons';
import { Divider, Grid, Typography } from '@mui/material';
import { HumanizeAmount } from 'components/AssetAmount';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { useBridgeFeeQuery } from 'hooks/bridge-operation';
import React from 'react';
import { Details } from './styled';

interface TransferDetailsProps {
  selectedAsset: Asset;
}

export const TransferDetails: React.FC<TransferDetailsProps> = (props) => {
  const { selectedAsset } = props;

  const { bridgeToAmount, bridgeFromAmount, recipient } = BridgeOperationFormContainer.useContainer();
  const feeQuery = useBridgeFeeQuery();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
  };

  return (
    <Details>
      <Grid container justifyContent="space-between">
        <Grid item display="flex">
          <Typography fontWeight={400} color="text.secondary">
            To
          </Typography>
          <Typography marginLeft={0.5} fontWeight={700} color="primary.light">
            {formatAddress(recipient)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography fontWeight={400} color="primary.light">
            {bridgeFromAmount}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography fontWeight={400} color="text.secondary">
            Gas fee
          </Typography>
        </Grid>
        <Grid item>{feeQuery.data && <HumanizeAmount asset={feeQuery.data.fee} />}</Grid>
      </Grid>
      <Divider />
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography fontWeight={700} color="primary.light">
            Amount after fees
          </Typography>
        </Grid>
        <Grid item>
          <Typography fontWeight={700} color="primary.light">
            {bridgeToAmount} {selectedAsset.info?.name}
          </Typography>
        </Grid>
      </Grid>
    </Details>
  );
};
