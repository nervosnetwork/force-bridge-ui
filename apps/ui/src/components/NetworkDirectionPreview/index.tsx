import { NERVOS_NETWORK } from '@force-bridge/commons';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Avatar, Button, Grid } from '@mui/material';
import React, { useMemo } from 'react';
import { Switcher } from './styled';
import ethereumlogo from 'assets/images/ethereum-logo.png';
import nervoslogo from 'assets/images/nervos-logo-mark.jpg';
import { BridgeDirection } from 'containers/ForceBridgeContainer';

interface NetworkDirectionPreviewProps {
  networks: string[];
  network: string;
  direction: BridgeDirection;
  onSelect: (config: { network: string; direction: BridgeDirection }) => void;
}

export const NetworkDirectionPreview: React.FC<NetworkDirectionPreviewProps> = (props) => {
  const { network, direction, onSelect } = props;

  const selected = useMemo(() => {
    if (direction === BridgeDirection.In) return { from: network, to: NERVOS_NETWORK };
    return { from: NERVOS_NETWORK, to: network };
  }, [direction, network]);

  const fromLogo = selected.from === 'Ethereum' ? ethereumlogo : nervoslogo;
  const toLogo = selected.to === 'Nervos' ? nervoslogo : ethereumlogo;
  const directionChangeNetwork = direction === BridgeDirection.In ? BridgeDirection.Out : BridgeDirection.In;
  return (
    <Switcher>
      <Grid container justifyContent="center">
        <Grid
          item
          order={1}
          onClick={() =>
            onSelect({
              direction: directionChangeNetwork,
              network: 'Ethereum',
            })
          }
        >
          <div className="bg-gradient">
            <Avatar alt="Remy Sharp" src={fromLogo} />
          </div>
          <Button variant="contained" size="small">
            {selected.from}
          </Button>
        </Grid>
        <Grid item order={2}>
          <ChevronDoubleRightIcon />
        </Grid>
        <Grid item order={3} onClick={() => onSelect({ direction: directionChangeNetwork, network: 'Ethereum' })}>
          <div className="bg-gradient">
            <Avatar alt="Remy Sharp" src={toLogo} />
          </div>
          <Button variant="contained" size="small">
            {selected.to}
          </Button>
        </Grid>
      </Grid>
    </Switcher>
  );
};
