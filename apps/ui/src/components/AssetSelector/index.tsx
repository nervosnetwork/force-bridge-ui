import { AmountWithoutDecimals, FungibleBaseInfo } from '@force-bridge/commons';
import { Button, ButtonProps, List, Modal } from 'antd';
import React, { useState } from 'react';
import { AssetAmount } from 'components/AssetAmount';
import { AssetSymbol } from 'components/AssetSymbol';

type AssetWithInfoLike = {
  amount: AmountWithoutDecimals;
  info: FungibleBaseInfo;
};

interface AssetSelectorProps<T extends AssetWithInfoLike> {
  selected?: string;
  options: T[];
  rowKey: (item: T) => string;
  onSelect: (key: React.Key, asset: T) => void;
  btnProps?: ButtonProps;
}

export function AssetSelector<T extends AssetWithInfoLike>(props: AssetSelectorProps<T>): React.ReactElement {
  const [visible, setModalVisible] = useState(false);

  const { options, selected, onSelect, rowKey, btnProps } = props;
  const selectedAsset = selected != null && options.find((asset) => rowKey(asset) === selected);

  function onSelectInternal(item: T) {
    setModalVisible(false);
    onSelect(rowKey(item), item);
  }

  function onButtonClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    setModalVisible(true);
    btnProps?.onClick?.(e);
  }

  return (
    <span>
      <Button type="primary" size="small" {...btnProps} onClick={onButtonClick}>
        {selectedAsset ? <AssetSymbol info={selectedAsset.info} /> : 'Select'}
      </Button>
      <Modal width={312} visible={visible} onCancel={() => setModalVisible(false)} footer={null}>
        <List
          pagination={false}
          dataSource={options}
          rowKey={rowKey}
          renderItem={(item) => (
            <List.Item onClick={() => onSelectInternal(item)}>
              <AssetSymbol info={item.info} />
              <AssetAmount amount={item.amount} info={item.info} />
            </List.Item>
          )}
        />
      </Modal>
    </span>
  );
}
