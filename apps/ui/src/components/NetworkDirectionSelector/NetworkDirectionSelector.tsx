import { NERVOS_NETWORK } from '@force-bridge/commons';
import { Dropdown, Menu } from 'antd';
import React, { useMemo } from 'react';
import { NetworkDirection } from 'components/Network';
import { LinearGradientButton } from 'components/Styled';
import { BridgeDirection } from 'containers/ForceBridgeContainer';
import { Avatar, Button, Grid } from '@mui/material';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import nervoslogo from '../../assets/images/nervos-logo-mark.jpg';
import ethereumlogo from '../../assets/images/ethereum-logo.png';
import '../../assets/styles/switcher.scss';
import { Switcher } from './styled';

interface NetworkDirectionSelectorProps {
  networks: string[];
  network: string;
  direction: BridgeDirection;
  onSelect: (config: { network: string; direction: BridgeDirection }) => void;
}

export const NetworkDirectionSelector: React.FC<NetworkDirectionSelectorProps> = (props) => {
  const { network, direction, networks, onSelect } = props;

  const selected = useMemo(() => {
    if (direction === BridgeDirection.In) return { from: network, to: NERVOS_NETWORK };
    return { from: NERVOS_NETWORK, to: network };
  }, [direction, network]);

  const switcherItems = networks.flatMap((network) => [
    { key: network + '-' + NERVOS_NETWORK, network, direction: BridgeDirection.In, from: network, to: NERVOS_NETWORK },
    { key: NERVOS_NETWORK + '-' + network, network, direction: BridgeDirection.Out, from: NERVOS_NETWORK, to: network },
  ]);

  return (
    <Switcher>
      <Grid container justifyContent="center">
        <Grid item order={1} onClick={() => onSelect({ direction: BridgeDirection.In, network: 'Ethereum' })}>
          <div className="bg-gradient">
            <Avatar alt="Remy Sharp" src={nervoslogo} />
          </div>
          <Button variant="contained" size="small">
            {selected.to}
          </Button>
        </Grid>
        <Grid item order={2}>
          <ChevronDoubleRightIcon />
        </Grid>
        <Grid item order={3} onClick={() => onSelect({ direction: BridgeDirection.Out, network: 'Ethereum' })}>
          <div className="bg-gradient">
            <Avatar alt="Remy Sharp" src={ethereumlogo} />
          </div>
          <Button variant="contained" size="small">
            {selected.from}
          </Button>
        </Grid>
      </Grid>
    </Switcher>

    // <Dropdown trigger={['click']} overlay={directionsElem}>
    //   <LinearGradientButton block type="primary">
    //     {selectedItem}asd
    //   </LinearGradientButton>
    // </Dropdown>
  );
};
