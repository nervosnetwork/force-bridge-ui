import { AvatarProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CustomizedAvatar } from './styled';
import bscSmalllogo from 'assets/images/bsc_logo.jpg';
import ckbSmallLogo from 'assets/images/ckb-small-logo.png';
import ethSmallLogo from 'assets/images/eth-small-logo.png';

export interface AssetLogoProps extends AvatarProps {
  network: string;
}

export const AssetLogo: React.FC<AssetLogoProps> = (props) => {
  const { network, ...avatarProps } = props;
  const [assetLogo, setAssetLogo] = useState<string>();

  useEffect(() => {
    let result;
    switch (network) {
      case 'Ethereum':
        result = ethSmallLogo;
        break;
      case 'Nervos':
        result = ckbSmallLogo;
        break;
      case 'Bsc':
        result = bscSmalllogo;
        break;
    }
    setAssetLogo(result);
  }, [network]);

  return <CustomizedAvatar {...avatarProps} src={assetLogo} />;
};
