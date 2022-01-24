import { AmountWithoutDecimals, FungibleBaseInfo } from '@force-bridge/commons';
import { MenuItem, Typography } from '@mui/material';
import { ButtonProps } from 'antd';
import React from 'react';
import { HumanizeAmount } from 'components/AssetAmount';
import { CustomizedSelect } from 'components/AssetSelector/styled';
import { AssetSymbol } from 'components/AssetSymbol';

type AssetWithInfoLike = {
  amount: AmountWithoutDecimals;
  info?: FungibleBaseInfo;
};

interface AssetSelectorProps<T extends AssetWithInfoLike> {
  selected?: string;
  options: T[];
  rowKey: (item: T) => string;
  onSelect: (key: string, asset: T) => void;
  btnProps?: ButtonProps;
}

export function AssetSelector<T extends AssetWithInfoLike>(props: AssetSelectorProps<T>): React.ReactElement {
  const { options, selected, onSelect, rowKey } = props;
  const selectedAsset = selected != null && options.find((asset) => rowKey(asset) === selected)?.info?.name;

  function onSelectInternal(item: T) {
    onSelect(rowKey(item), item);
  }

  return (
    <>
      <Typography color="text.primary" variant="body1" marginTop={3} marginBottom={1}>
        Asset
      </Typography>
      <CustomizedSelect fullWidth value={selectedAsset}>
        {options.map((item) => (
          <MenuItem value={item.info?.name} key={item.info?.name} onClick={() => onSelectInternal(item)}>
            <AssetSymbol info={item.info} />
            <HumanizeAmount asset={item} />
          </MenuItem>
        ))}
      </CustomizedSelect>
    </>
  );
}
