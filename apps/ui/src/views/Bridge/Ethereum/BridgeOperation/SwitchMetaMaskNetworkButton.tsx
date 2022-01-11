import { Button, ButtonProps, Tooltip } from 'antd';
import React from 'react';
import { useSwitchMetaMaskNetwork } from '../hooks/useSwitchMetaMaskNetwork';

interface SwitchMetaMaskNetworkButtonProps extends ButtonProps {
  chainId: string;
  chainName: string;
}

export const SwitchMetaMaskNetworkButton: React.FC<SwitchMetaMaskNetworkButtonProps> = (props) => {
  const { chainId, chainName } = props;
  const { mutateAsync: switchMetaMaskNetwork, isLoading } = useSwitchMetaMaskNetwork();
  const title = `Switch metamask connected
    network to current bridge network(${chainName})`;

  return (
    <Tooltip title={title}>
      <Button loading={isLoading} block type="primary" size="large" onClick={() => switchMetaMaskNetwork({ chainId })}>
        Switch MetaMask Network
      </Button>
    </Tooltip>
  );
};
