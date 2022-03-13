import { NERVOS_NETWORK } from '@force-bridge/commons';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Button, Grid } from '@mui/material';
import React, { useMemo } from 'react';
import { Switcher } from './styled';

import { AssetLogo } from 'components/AssetLogo/index';
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
              network: network,
            })
          }
        >
          <div className="bg-gradient">
            <AssetLogo network={selected.from} isSmall={false} />
          </div>
          <Button variant="contained" size="small">
            {selected.from}
          </Button>
        </Grid>
        <Grid item order={2}>
          <ChevronDoubleRightIcon />
        </Grid>
        <Grid item order={3} onClick={() => onSelect({ direction: directionChangeNetwork, network: network })}>
          <div className="bg-gradient">
            <AssetLogo network={selected.to} isSmall={false} />
          </div>
          <Button variant="contained" size="small">
            {selected.to}
          </Button>
        </Grid>
      </Grid>
    </Switcher>
  );
};
