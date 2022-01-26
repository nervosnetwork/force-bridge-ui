import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Typography } from '@mui/material';
import React from 'react';
import { NetworkItem } from './styled';
import { AssetLogo } from 'components/AssetLogo';

export interface NetworkDirectionProps {
  from: string;
  to: string;
}

export const NetworkDirection: React.FC<NetworkDirectionProps> = (props) => {
  const { from, to } = props;

  return (
    <NetworkItem>
      <AssetLogo sx={{ width: 20, height: 20 }} network={from} />
      <Typography>{from}</Typography>
      <ChevronDoubleRightIcon />
      <AssetLogo sx={{ width: 20, height: 20 }} network={to} />
      <Typography>{to}</Typography>
    </NetworkItem>
  );
};
