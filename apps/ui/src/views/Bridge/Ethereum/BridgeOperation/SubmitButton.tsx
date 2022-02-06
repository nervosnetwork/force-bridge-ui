import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import { Button, ButtonProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { AllowanceState } from 'views/Bridge/Ethereum/hooks/useAllowance';

interface SubmitButtonProps extends ButtonProps {
  allowanceStatus: AllowanceState | undefined;
}

export const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const [buttonText, setButtonText] = useState<string>();
  const { allowanceStatus, ...buttonProps } = props;
  const { walletConnectStatus } = ForceBridgeContainer.useContainer();
  const isConnected = walletConnectStatus === ConnectStatus.Connected;

  useEffect(() => {
    let content;
    if (allowanceStatus) {
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
    } else {
      content = !isConnected ? 'Connect Wallet' : 'Transfer';
    }
    setButtonText(content);
  }, [allowanceStatus, isConnected]);

  const showStartIcon = allowanceStatus ? allowanceStatus.status === 'Approved' : isConnected;

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={showStartIcon && <SwitchHorizontalIcon />}
      fullWidth
      sx={{ marginTop: 5, padding: 2 }}
      {...buttonProps}
    >
      {buttonText}
    </Button>
  );
};
