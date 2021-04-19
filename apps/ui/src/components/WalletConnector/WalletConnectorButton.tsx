import { Button, ButtonProps } from 'antd';
import React, { useMemo } from 'react';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { useForceBridge } from 'state/global';

export interface WalletConnectorButtonProps extends ButtonProps {
  disconnectedContent?: React.ReactNode;
  connectingContent?: React.ReactNode;
}

export const WalletConnectorButton: React.FC<WalletConnectorButtonProps> = (props) => {
  const {
    disconnectedContent = 'Connect a Wallet To Start',
    connectingContent = 'Connecting...',
    ...buttonProps
  } = props;
  const { signer, walletConnectStatus, globalSetting, wallet } = useForceBridge();

  const userIdentityMode = globalSetting.userIdentityMode;

  const buttonContent = useMemo(() => {
    if (walletConnectStatus === ConnectStatus.Disconnected) return disconnectedContent;
    if (walletConnectStatus === ConnectStatus.Connecting) return connectingContent;
    if (!signer) return connectingContent;

    if (userIdentityMode === 'alwaysNervos') return signer.identityNervos();

    return signer.identityOrigin();
  }, [walletConnectStatus, disconnectedContent, signer, connectingContent, userIdentityMode]);

  function onClick() {
    wallet.connect();
  }

  const connecting =
    walletConnectStatus === ConnectStatus.Connecting || (walletConnectStatus === ConnectStatus.Connected && !signer);

  return (
    <Button {...buttonProps} onClick={onClick} loading={connecting}>
      {buttonContent}
    </Button>
  );
};
