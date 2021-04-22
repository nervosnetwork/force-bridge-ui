import { AmountWithoutDecimals } from '@force-bridge/commons';
import React from 'react';
import { BeautyAmount, HumanizeOptions } from 'suite';

interface AssetAmountProps extends HumanizeOptions {
  amount: AmountWithoutDecimals;
  info: { decimals: number; symbol: string };
}

export const AssetAmount: React.FC<AssetAmountProps> = (props) => {
  const beauty = BeautyAmount.from(props);

  return <span>{beauty.humanize(props)}</span>;
};
