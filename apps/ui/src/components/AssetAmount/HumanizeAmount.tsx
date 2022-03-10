import { AssetType } from '@force-bridge/commons';
import { Typography } from '@mui/material';
import { Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { useAssetInfoListQuery } from 'hooks/useAssetInfoListQuery';
import { BeautyAmount, HumanizeOptions } from 'libs';

interface HumanizeAmountProps {
  asset: Partial<AssetType>;
  humanize?: HumanizeOptions;
  showSymbol?: boolean;
}

export const HumanizeAmount: React.FC<HumanizeAmountProps> = (props) => {
  const { asset, humanize, showSymbol } = props;
  const { infoOf } = useAssetInfoListQuery();

  const info = useMemo(() => {
    if (asset.info) return asset.info;

    let result;
    if (asset.network != null && asset.ident != null) {
      result = infoOf({ network: asset.network, ident: asset.ident });
    }
    return result ?? { decimals: 0, symbol: 'Unknown' };
  }, [asset, infoOf]);

  const beauty = BeautyAmount.from(asset.amount ?? '0', info?.decimals);

  return (
    <Tooltip title={beauty.humanize() + ' ' + info?.symbol}>
      <Typography color="primary.light" variant="body2" fontWeight={400} marginLeft={1.5}>
        {beauty.humanize({ decimalPlaces: humanize?.decimalPlaces ?? 8, separator: humanize?.separator })}
        {showSymbol && ' ' + info?.symbol}
      </Typography>
    </Tooltip>
  );
};
