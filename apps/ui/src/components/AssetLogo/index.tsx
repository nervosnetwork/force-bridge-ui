import { Avatar, AvatarProps } from '@mui/material';
import React from 'react';
import ethSmallLogo from '../../assets/images/eth-small-logo.png';
import ckbSmallLogo from '../../assets/images/ckb-small-logo.png';
import { CustomizedAvatar } from './styled';

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
    }
    return result;
  };

  return <>{getAssetLogo(network)}</>;
};
