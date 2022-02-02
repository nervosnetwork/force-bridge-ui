import { AvatarProps } from '@mui/material';
import React from 'react';
import { CustomizedAvatar } from './styled';
import bscSmalllogo from 'assets/images/bsc_logo.jpg';
import ckbSmallLogo from 'assets/images/ckb-small-logo.png';
import ethSmallLogo from 'assets/images/eth-small-logo.png';

export interface AssetLogoProps extends AvatarProps {
  network: string;
}

export const AssetLogo: React.FC<AssetLogoProps> = (props) => {
  const { network, ...avatarProps } = props;

  const getAssetLogo = (network: string) => {
    let result;
    switch (network) {
      case 'Ethereum':
        result = <CustomizedAvatar {...avatarProps} src={ethSmallLogo} />;
        break;
      case 'Nervos':
        result = <CustomizedAvatar {...avatarProps} src={ckbSmallLogo} />;
        break;
      case 'Bsc':
        result = <CustomizedAvatar {...avatarProps} src={bscSmalllogo} />;
        break;
    }
    return result;
  };

  return <>{getAssetLogo(network)}</>;
};
