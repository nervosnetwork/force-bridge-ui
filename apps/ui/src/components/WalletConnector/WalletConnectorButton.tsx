import { Button, ButtonProps } from 'antd';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { UserIdent } from 'components/UserIdent';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { BridgeDirection, useForceBridge } from 'state/global';

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
  const { signer, walletConnectStatus, globalSetting, wallet, direction } = useForceBridge();

  const userIdentityMode = globalSetting.userIdentityMode;

  const buttonContent = useMemo(() => {
    if (walletConnectStatus === ConnectStatus.Disconnected) return disconnectedContent;
    if (walletConnectStatus === ConnectStatus.Connecting) return connectingContent;
    if (!signer) return connectingContent;

    if (userIdentityMode === 'alwaysXChain') return <UserIdent ident={signer.identityXChain()} />;
    if (userIdentityMode === 'alwaysNervos') return <UserIdent ident={signer.identityNervos()} />;

    if (direction === BridgeDirection.In) return <UserIdent ident={signer.identityXChain()} />;
    return <UserIdent ident={signer.identityNervos()} />;
  }, [walletConnectStatus, disconnectedContent, signer, connectingContent, userIdentityMode, direction]);

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
