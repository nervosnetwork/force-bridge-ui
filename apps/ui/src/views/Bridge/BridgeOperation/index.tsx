import Icon from '@ant-design/icons';
import { Button, Divider, Row } from 'antd';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as BridgeDirectionIcon } from './resources/icon-bridge-direction.svg';
import { useBridge } from './useBridge';
import { AssetAmount } from 'components/AssetAmount';
import { AssetSelector } from 'components/AssetSelector';
import { AssetSymbol } from 'components/AssetSymbol';
import { StyledCardWrapper } from 'components/Styled';
import { UserInput } from 'components/UserInput';
import { WalletConnectorButton } from 'components/WalletConnector';
import { BridgeDirection, useAssetQuery, useForceBridge } from 'state';

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
  const { signer, direction } = useForceBridge();
  const query = useAssetQuery();

  const {
    bridgeOutInputAmount,
    bridgeInInputAmount,
    setBridgeInInputAmount,
    asset: selectedAsset,
    setAsset: setSelectedAsset,
    setRecipient,
    recipient,
    errors,
    validateStatus,
    fee,
    reset,
  } = useBridge();

  useEffect(() => {
    reset();
    if (!signer) return;

    if (direction === BridgeDirection.In) setRecipient(signer.identityNervos());
    else setRecipient(signer.identityXChain());
  }, [direction, reset, setRecipient, signer]);

  return (
    <BridgeViewWrapper>
      <WalletConnectorButton block type="primary" />

      <div className="input-wrapper">
        <UserInput
          value={bridgeInInputAmount}
          onChange={(e) => setBridgeInInputAmount(e.target.value)}
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
          extra={
            selectedAsset && (
              <Button type="link" size="small">
                MAX:&nbsp;
                <AssetAmount amount={selectedAsset.amount} info={selectedAsset.info} />
              </Button>
            )
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
              {selectedAsset && <AssetSymbol info={selectedAsset?.shadow?.info} />}
            </span>
          }
          extra={
            fee && (
              <span>
                Fee: <AssetAmount amount={fee?.amount ?? '0'} info={fee?.info} />
              </span>
            )
          }
          placeholder="0.0"
          disabled
          value={bridgeOutInputAmount}
        />
      </div>
      <Divider dashed style={{ margin: 0, padding: 0 }} />
      <div className="input-wrapper">
        <UserInput
          label={<span className="label">Recipient</span>}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <Button disabled={!validateStatus || !!errors} block type="primary" size="large">
        Bridge
      </Button>
    </BridgeViewWrapper>
  );
};
