import { NERVOS_NETWORK } from '@force-bridge/commons';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Button, Menu, Typography } from '@mui/material';
import React from 'react';
import { NetworkDirectionMenu, NetworkItem } from './styled';
import { AssetLogo } from 'components/AssetLogo';
import { BridgeDirection } from 'containers/ForceBridgeContainer';

interface NetworkDirection {
  network: string;
  direction: BridgeDirection;
}

interface NetworkDirectionSelectorProps extends NetworkDirection {
  networks: string[];
  onSelect: (config: { network: string; direction: BridgeDirection }) => void;
}

export const NetworkDirectionSelector: React.FC<NetworkDirectionSelectorProps> = (props) => {
  const { networks, onSelect } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: NetworkDirection) => {
    onSelect({ direction: item.direction, network: item.network });
    setAnchorEl(null);
  };

  const directionItems = networks.flatMap((network) => [
    { key: network + '-' + NERVOS_NETWORK, network, direction: BridgeDirection.In, from: network, to: NERVOS_NETWORK },
    { key: NERVOS_NETWORK + '-' + network, network, direction: BridgeDirection.Out, from: NERVOS_NETWORK, to: network },
  ]);

  return (
    <NetworkDirectionMenu>
      <Button variant="contained" color="secondary" onClick={handleClick}>
        Change network direction
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {directionItems.map((item) => (
          <NetworkItem key={item.key} onClick={() => handleMenuItemClick(item)}>
            <AssetLogo sx={{ width: 20, height: 20 }} network={item.from} isSmall />
            <Typography>{item.from}</Typography>
            <ChevronDoubleRightIcon />
            <AssetLogo sx={{ width: 20, height: 20 }} network={item.to} isSmall />
            <Typography>{item.to}</Typography>
          </NetworkItem>
        ))}
      </Menu>
    </NetworkDirectionMenu>
  );
};
