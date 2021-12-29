import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Typography } from '@mui/material';
import { HumanizeAmount } from 'components/AssetAmount';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { useBridgeFeeQuery } from 'hooks/bridge-operation';
import React from 'react';
import { CustomizedAccordion } from './styled';

export const TransferDetails: React.FC = () => {
  const { bridgeToAmount } = BridgeOperationFormContainer.useContainer();
  const feeQuery = useBridgeFeeQuery();

  return (
    <CustomizedAccordion sx={{ marginTop: 4 }} disableGutters>
      <AccordionSummary>
        <Typography>Receive {bridgeToAmount} ETH</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography color="text.secondary">Gas fee</Typography>
          </Grid>
          <Grid item>
            <Typography>{feeQuery.data && <HumanizeAmount asset={feeQuery.data.fee} />} </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography>Amount after fees</Typography>
          </Grid>
          <Grid item>
            <Typography>120.0004 ETH</Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </CustomizedAccordion>
  );
};
