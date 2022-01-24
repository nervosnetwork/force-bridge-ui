import React from 'react';
import { AssetLogo } from 'components/AssetLogo';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Typography } from '@mui/material';
import { NetworkItem } from './styled';

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
