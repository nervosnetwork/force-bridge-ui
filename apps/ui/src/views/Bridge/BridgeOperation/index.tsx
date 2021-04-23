import Icon from '@ant-design/icons';
import { Asset } from '@force-bridge/commons';
import { Button, Divider, Row } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as BridgeDirectionIcon } from './resources/icon-bridge-direction.svg';
import { AssetSelector } from 'components/AssetSelector';
import { AssetSymbol } from 'components/AssetSymbol';
import { StyledCardWrapper } from 'components/Styled';
import { UserInput } from 'components/UserInput';
import { WalletConnectorButton } from 'components/WalletConnector';
import { useForceBridge } from 'state';
import { useAssetQuery } from 'state/assets/useAssetQuery';

const BridgeViewWrapper = styled(StyledCardWrapper)`
  .label {
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.8);
  }

  .input-wrapper {
    padding: 24px 0;
  }
`;

export const BridgeOperation: React.FC = () => {
  const { signer } = useForceBridge();
  const query = useAssetQuery();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  return (
    <BridgeViewWrapper>
      <WalletConnectorButton block type="primary" />
      <div className="input-wrapper">
        <UserInput
          label={
            <span>
              <label className="label">From:</label>&nbsp;
              <AssetSelector
                btnProps={{ disabled: query.data == null }}
                options={query.data?.xchain || []}
                rowKey={(asset) => asset.identity()}
                selected={selectedAsset?.identity()}
                onSelect={(_id, asset) => setSelectedAsset(asset)}
              />
            </span>
          }
          placeholder="0.0"
          disabled={signer == null}
        />
      </div>
      <Row justify="center" align="middle">
        <Icon style={{ fontSize: '24px' }} component={BridgeDirectionIcon} />
      </Row>
      <div className="input-wrapper">
        <UserInput
          label={
            <span>
              <label className="label">To:</label>&nbsp;
              <AssetSymbol />
            </span>
          }
          placeholder="0.0"
          disabled
        />
      </div>
      <Divider dashed style={{ margin: 0, padding: 0 }} />
      <div className="input-wrapper">
        <UserInput label={<span className="label">Recipient</span>} />
      </div>

      <Button block type="primary" size="large">
        Bridge
      </Button>
    </BridgeViewWrapper>
  );
};
