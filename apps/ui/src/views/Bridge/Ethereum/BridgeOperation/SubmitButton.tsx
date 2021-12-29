import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import { Button } from '@mui/material';
import { ButtonProps } from 'antd';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { ConnectStatus } from 'interfaces/WalletConnector';
import React from 'react';
import { AllowanceState } from 'views/Bridge/Ethereum/hooks/useAllowance';

interface SubmitButtonProps extends ButtonProps {
  isloading: boolean;
  allowanceStatus: AllowanceState | undefined;
}

export const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { isloading, allowanceStatus, ...buttonProps } = props;
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

  let isLoading = false;
  let content;
  if (allowanceStatus.status === 'Querying' || allowanceStatus.status === 'Approving' || isloading) {
    isLoading = true;
  }
  switch (allowanceStatus.status) {
    case 'NeedApprove':
      content = 'Approve';
      break;
    case 'Approving':
      content = 'Approving';
      break;
    case 'Approved':
      content = 'Bridge';
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
