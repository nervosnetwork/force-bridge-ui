import { Asset } from '@force-bridge/commons';
import { AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import React from 'react';
import { CustomizedAccordion } from './styled';
import { TransferDetails } from 'components/TransferDetails';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';

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
          <Typography color="primary.light">
            Receive {bridgeToAmount} {selectedAsset?.shadow?.info?.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TransferDetails selectedAsset={selectedAsset} />
        </AccordionDetails>
      </CustomizedAccordion>
    </>
  );
};
