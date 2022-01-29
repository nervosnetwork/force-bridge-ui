import { Button, Tooltip } from '@mui/material';
import React from 'react';
import { useSwitchMetaMaskNetwork } from '../hooks/useSwitchMetaMaskNetwork';

interface SwitchMetaMaskNetworkButtonProps {
  chainId: string;
  chainName?: string;
}

export const SwitchMetaMaskNetworkButton: React.FC<SwitchMetaMaskNetworkButtonProps> = (props) => {
  const { chainId, chainName } = props;
  const { mutateAsync: switchMetaMaskNetwork } = useSwitchMetaMaskNetwork();
  const title = `Switch metamask connected
    network to current bridge network(${chainName})`;

  return (
    <Tooltip title={title}>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ marginTop: 5, padding: 2 }}
        onClick={() => switchMetaMaskNetwork({ chainId })}
      >
        Switch MetaMask Network
      </Button>
    </Tooltip>
  );
};
