import { AccordionDetails, AccordionSummary, Box, Divider, Grid, Typography } from '@mui/material';
import { HumanizeAmount } from 'components/AssetAmount';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { useBridgeFeeQuery } from 'hooks/bridge-operation';
import React from 'react';
import { CustomizedAccordion, CustomizedExclamationIcon } from './styled';

export const TransferDetails: React.FC = () => {
  const { bridgeToAmount } = BridgeOperationFormContainer.useContainer();
  const feeQuery = useBridgeFeeQuery();

  return (
    <>
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
              <Typography>{bridgeToAmount} ETH</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </CustomizedAccordion>
      <Box display="flex" alignItems="center" flexDirection="column" marginTop={3}>
        <CustomizedExclamationIcon />
        <Typography color="text.secondary" textAlign="center" fontWeight={400}>
          Do not use an exchange address. <br />
          Fees vary with token price.
        </Typography>
      </Box>
    </>
  );
};
