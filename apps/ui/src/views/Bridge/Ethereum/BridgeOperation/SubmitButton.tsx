import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import LoadingButton from '@mui/lab/LoadingButton';
import { ButtonProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { AllowanceState } from 'views/Bridge/Ethereum/hooks/useAllowance';

interface SubmitButtonProps extends ButtonProps {
  allowanceStatus: AllowanceState | undefined;
  isloading: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { isloading, allowanceStatus, ...buttonProps } = props;
  const [buttonText, setButtonText] = useState<string>();
  const { walletConnectStatus } = ForceBridgeContainer.useContainer();
  const isConnected = walletConnectStatus === ConnectStatus.Connected;

  let isLoading = false;
  if (allowanceStatus?.status === 'Querying' || allowanceStatus?.status === 'Approving' || isloading) {
    isLoading = true;
  }

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
    <LoadingButton
      loading={isLoading}
      loadingPosition="start"
      variant="contained"
      color="secondary"
      startIcon={showStartIcon && <SwitchHorizontalIcon />}
      fullWidth
      sx={{ marginTop: 2, padding: 2 }}
      {...buttonProps}
    >
      {buttonText}
    </LoadingButton>
  );
};
