import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { CustomizedAccordion } from './styled';

export const TransferDetails: React.FC = () => {
  return (
    <CustomizedAccordion sx={{ marginTop: 4 }} disableGutters>
      <AccordionSummary>
        <Typography>Receive 120.0004 ETH</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography color="text.secondary">Cross Chain fee</Typography>
          </Grid>
          <Grid item>
            <Typography>.242 ETH</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography color="text.secondary">Gas fee</Typography>
          </Grid>
          <Grid item>
            <Typography>.01 ETH</Typography>
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
