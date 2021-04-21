import { Button, ButtonProps } from 'antd';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { useForceBridge } from 'state/global';
import { truncateMiddle } from 'utils';

const StyledWalletConnectButton = styled(Button)`
  border: none;
  color: ${(props) => props.theme.palette.common.black};
  font-weight: 700;
  background: linear-gradient(93.35deg, #b8f0d5 3.85%, #b8f0ed 100%);

  :hover {
    color: ${(props) => props.theme.palette.common.black};
    background: linear-gradient(93.35deg, #b8f0d5 3.85%, #b8f0ed 100%);
  }

  :active {
    color: ${(props) => props.theme.palette.common.black};
    background: linear-gradient(93.35deg, #b8f0d5 3.85%, #b8f0ed 100%);
  }

  :focus {
    color: ${(props) => props.theme.palette.common.black};
    background: linear-gradient(93.35deg, #b8f0d5 3.85%, #b8f0ed 100%);
  }
`;

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

    if (userIdentityMode === 'alwaysNervos') return truncateMiddle(signer.identityNervos(), 10);

    return signer.identityOrigin();
  }, [walletConnectStatus, disconnectedContent, signer, connectingContent, userIdentityMode]);

  function onClick() {
    wallet.connect();
  }

  const connecting =
    walletConnectStatus === ConnectStatus.Connecting || (walletConnectStatus === ConnectStatus.Connected && !signer);

  return (
    <StyledWalletConnectButton {...buttonProps} onClick={onClick} loading={connecting}>
      {buttonContent}
    </StyledWalletConnectButton>
  );
};
