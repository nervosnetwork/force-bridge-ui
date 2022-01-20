import { Asset } from '@force-bridge/commons';
import { AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { TransferDetails } from 'components/TransferDetails';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import React from 'react';
import { CustomizedAccordion, CustomizedExclamationIcon } from './styled';

interface TransferDetailsProps {
  selectedAsset: Asset;
}

export const TransferAccordion: React.FC<TransferDetailsProps> = (props) => {
  const { selectedAsset } = props;
  const { bridgeToAmount } = BridgeOperationFormContainer.useContainer();

  return (
    <>
      <CustomizedAccordion sx={{ marginTop: 4 }} disableGutters>
        <AccordionSummary>
          <Typography color="primary.light">Receive {bridgeToAmount} ETH</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TransferDetails selectedAsset={selectedAsset} />
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
