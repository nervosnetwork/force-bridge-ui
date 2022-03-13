import { AvatarProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CustomizedAvatar } from './styled';
import bsclogo from 'assets/images/bsc-logo.png';
import bscSmalllogo from 'assets/images/bsc_logo_small.png';
import ckbSmallLogo from 'assets/images/ckb-small-logo.png';
import ethSmallLogo from 'assets/images/eth-small-logo.png';
import ethereumlogo from 'assets/images/ethereum-logo.png';
import nervoslogo from 'assets/images/nervos-logo-mark.jpg';

export interface AssetLogoProps extends AvatarProps {
  network: string;
  isSmall: boolean;
}

export const AssetLogo: React.FC<AssetLogoProps> = (props) => {
  const { network, isSmall, ...avatarProps } = props;
  const [assetLogo, setAssetLogo] = useState<string>();

  useEffect(() => {
    let result;
    switch (network) {
      case 'Ethereum':
        result = isSmall ? ethSmallLogo : ethereumlogo;
        break;
      case 'Nervos':
        result = isSmall ? ckbSmallLogo : nervoslogo;
        break;
      case 'Bsc':
        result = isSmall ? bscSmalllogo : bsclogo;
        break;
    }
    setAssetLogo(result);
  }, [network, isSmall]);

  return <CustomizedAvatar {...avatarProps} src={assetLogo} />;
};
