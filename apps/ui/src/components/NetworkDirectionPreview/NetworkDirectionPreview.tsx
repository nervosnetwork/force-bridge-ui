import { NERVOS_NETWORK } from '@force-bridge/commons';
import React, { useMemo } from 'react';
import { BridgeDirection } from 'containers/ForceBridgeContainer';
import { Avatar, Button, Grid } from '@mui/material';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import nervoslogo from '../../assets/images/nervos-logo-mark.jpg';
import ethereumlogo from '../../assets/images/ethereum-logo.png';
import { Switcher } from './styled';

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

  return (
    <Switcher>
      <Grid container justifyContent="center">
        <Grid item order={1} onClick={() => onSelect({ direction: BridgeDirection.In, network: 'Ethereum' })}>
          <div className="bg-gradient">
            <Avatar alt="Remy Sharp" src={ethereumlogo} />
          </div>
          <Button variant="contained" size="small">
            {selected.from}
          </Button>
        </Grid>
        <Grid item order={2}>
          <ChevronDoubleRightIcon />
        </Grid>
        <Grid item order={3} onClick={() => onSelect({ direction: BridgeDirection.Out, network: 'Ethereum' })}>
          <div className="bg-gradient">
            <Avatar alt="Remy Sharp" src={nervoslogo} />
          </div>
          <Button variant="contained" size="small">
            {selected.to}
          </Button>
        </Grid>
      </Grid>
    </Switcher>
  );
};
