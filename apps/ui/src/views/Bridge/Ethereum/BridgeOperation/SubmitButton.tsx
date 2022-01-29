import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { AllowanceState } from 'views/Bridge/Ethereum/hooks/useAllowance';

interface SubmitButtonProps extends ButtonProps {
  allowanceStatus: AllowanceState | undefined;
}

export const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { allowanceStatus, ...buttonProps } = props;
  const { walletConnectStatus } = ForceBridgeContainer.useContainer();
  const isConnected = walletConnectStatus === ConnectStatus.Connected;

  if (!allowanceStatus) {
    return (
      <Button
        variant="contained"
        color="secondary"
        startIcon={<SwitchHorizontalIcon />}
        fullWidth
        sx={{ marginTop: 5, padding: 2 }}
        {...buttonProps}
      >
        {!isConnected ? 'Connect Wallet' : 'Transfer'}
      </Button>
    );
  }

  let content;

  switch (allowanceStatus.status) {
    case 'NeedApprove':
      content = 'Approve';
      break;
    case 'Approving':
      content = 'Approving';
      break;
    case 'Approved':
      content = 'Transfer';
      break;
    default:
      content = ' ';
  }

  return (
    <Button variant="contained" color="secondary" fullWidth sx={{ marginTop: 5, padding: 2 }} {...buttonProps}>
      {content}
    </Button>
  );
};
