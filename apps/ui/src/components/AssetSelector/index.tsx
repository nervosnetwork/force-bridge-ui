import { AmountWithoutDecimals, FungibleBaseInfo } from '@force-bridge/commons';
import { Button, ButtonProps, List, Modal } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { HumanizeAmount } from 'components/AssetAmount';
import { AssetSymbol } from 'components/AssetSymbol';
import { CustomizedSelect } from 'components/AssetSelector/styled';
import { MenuItem, Typography } from '@mui/material';

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

const StyledModal = styled(Modal)`
  .ant-modal-close-x {
    line-height: 48px;
    height: 0;
  }
`;

const ModalBorderWrapper = styled.div`
  .ant-list-item {
    padding: 4px 0;
    margin: 4px 0;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0);

    &:hover {
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      cursor: pointer;
    }
  }
`;

export function AssetSelector<T extends AssetWithInfoLike>(props: AssetSelectorProps<T>): React.ReactElement {
  const [visible, setModalVisible] = useState(false);

  const { options, selected, onSelect, rowKey, btnProps } = props;
  const selectedAsset = selected != null && options.find((asset) => rowKey(asset) === selected)?.info?.name;

  function onSelectInternal(item: T) {
    onSelect(rowKey(item), item);
  }

  function onButtonClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    setModalVisible(true);
    btnProps?.onClick?.(e);
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
