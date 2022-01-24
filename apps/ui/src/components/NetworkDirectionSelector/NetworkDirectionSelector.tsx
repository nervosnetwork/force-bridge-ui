import { NERVOS_NETWORK } from '@force-bridge/commons';
import React from 'react';
import { BridgeDirection } from 'containers/ForceBridgeContainer';
import { Button, Menu, Typography } from '@mui/material';
import { NetworkDirectionMenu, NetworkItem } from './styled';
import { AssetLogo } from 'components/AssetLogo';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';

interface NetworkDirectionSelectorProps {
  networks: string[];
  network: string;
  direction: BridgeDirection;
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

  const handleMenuItemClick = (item: NetworkDirectionSelectorProps) => {
    onSelect({ direction: item.direction, network: item.network });
    setAnchorEl(null);
  };

  const directionItems = networks.flatMap((network) => [
    { key: network + '-' + NERVOS_NETWORK, network, direction: BridgeDirection.In, from: network, to: NERVOS_NETWORK },
    { key: NERVOS_NETWORK + '-' + network, network, direction: BridgeDirection.Out, from: NERVOS_NETWORK, to: network },
  ]);

  return (
    <NetworkDirectionMenu>
      <Button
        id="basic-button"
        variant="contained"
        color="secondary"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Change network direction
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {directionItems.map((item) => (
          <NetworkItem key={item.key} onClick={() => handleMenuItemClick(item)}>
            <AssetLogo sx={{ width: 20, height: 20 }} network={item.from} />
            <Typography>{item.from}</Typography>
            <ChevronDoubleRightIcon />
            <AssetLogo sx={{ width: 20, height: 20 }} network={item.to} />
            <Typography>{item.to}</Typography>
          </NetworkItem>
        ))}
      </Menu>
    </NetworkDirectionMenu>
  );
};
