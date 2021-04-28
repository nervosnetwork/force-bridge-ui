import { AmountWithoutDecimals } from '@force-bridge/commons';
import { Tooltip } from 'antd';
import React from 'react';
import { BeautyAmount, HumanizeOptions } from 'suite';

interface AssetAmountProps extends HumanizeOptions {
  amount: AmountWithoutDecimals;
  info?: { decimals?: number; symbol?: string };
}

export const AssetAmount: React.FC<AssetAmountProps> = ({ amount, info, decimalPlaces = 8, separator = true }) => {
  const beauty = BeautyAmount.from(amount, info?.decimals);

  return (
    <Tooltip title={beauty.humanize()}>
      <span>{beauty.humanize({ decimalPlaces, separator })}</span>
    </Tooltip>
  );
};
