import { AssetType } from '@force-bridge/commons';
import { Tooltip } from 'antd';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useAssetInfoListQuery } from 'hooks/useAssetInfoListQuery';
import { BeautyAmount, HumanizeOptions } from 'libs';

const HumanizeAmountWrapper = styled.span`
  .symbol {
    color: rgba(0, 0, 0, 0.6);
    margin-left: 4px;
  }
`;

interface HumanizeAmountProps {
  humanize?: HumanizeOptions;
  asset: Partial<AssetType>;
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
    <HumanizeAmountWrapper>
      <Tooltip title={beauty.humanize() + ' ' + info?.symbol}>
        <span>{beauty.humanize({ decimalPlaces: humanize?.decimalPlaces ?? 8, separator: humanize?.separator })}</span>
        {showSymbol && <span className="symbol">{info?.symbol}</span>}
      </Tooltip>
    </HumanizeAmountWrapper>
  );
};
