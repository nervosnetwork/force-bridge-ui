import { ButtonProps } from 'antd';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { LinearGradientButton } from 'components/Styled';
import { UserIdent } from 'components/UserIdent';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { useGlobalSetting } from 'hooks/useGlobalSetting';
import { ConnectStatus } from 'interfaces/WalletConnector';

const StyledWalletConnectButton = styled(LinearGradientButton)`
  color: ${(props) => props.theme.palette.common.black};
  font-weight: 700;
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
  const { signer, walletConnectStatus, wallet, direction } = ForceBridgeContainer.useContainer();
  const [globalSetting] = useGlobalSetting();

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
    wallet?.connect();
  }

  const connecting =
    walletConnectStatus === ConnectStatus.Connecting || (walletConnectStatus === ConnectStatus.Connected && !signer);

  return (
    <StyledWalletConnectButton {...buttonProps} onClick={onClick} loading={connecting}>
      {buttonContent}
    </StyledWalletConnectButton>
  );
};
