import { AlertOutlined, LoadingOutlined, FrownOutlined } from '@ant-design/icons';
import { Typography, Space } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { HumanizeAmount } from 'components/AssetAmount';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { asserts } from 'errors';

export const StyledReminderWrapper = styled.div`
  margin-top: 28px;
  padding: 18px;
  border-radius: 8px;
  border-color: #f7d749;
  border-width: thin;
  border-style: solid;
`;

export const BridgeReminder: React.FC = () => {
  const { api, direction, network } = ForceBridgeContainer.useContainer();
  const { asset } = BridgeOperationFormContainer.useContainer();

  // FIXME use network from ForceBridgeContainer if backend support
  const ethereumNetwork = 'Ethereum';
  const query = useQuery(
    ['getMinimalBridgeAmount', { asset: asset?.identity(), network }],
    () => {
      asserts(asset != null && asset.shadow != null);

      if (direction === BridgeDirection.In) {
        return api.getMinimalBridgeAmount({ network: ethereumNetwork, xchainAssetIdent: asset.ident });
      }

      return api.getMinimalBridgeAmount({ network: ethereumNetwork, xchainAssetIdent: asset.shadow.ident });
    },
    {
      enabled: !!asset,
      refetchInterval: false,
      retry: 3,
    },
  );

  if (!asset) return null;

  const minimalBridgeAmount = (
    <>
      {query.data && <HumanizeAmount showSymbol asset={{ ...asset, amount: query.data.minimalAmount }} />}
      {query.isLoading && <LoadingOutlined />}
      {query.isError && (
        <Space>
          <FrownOutlined />
          <Typography.Text type="danger">failed to get data</Typography.Text>
        </Space>
      )}
    </>
  );

  return (
    <StyledReminderWrapper>
      <Space>
        <AlertOutlined style={{ position: 'relative', bottom: '1px', color: '#f7d749' }} />
        <Typography.Text type="secondary">Reminder</Typography.Text>
      </Space>
      <Space direction="vertical" style={{ marginTop: '8px' }}>
        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
          1. Minimum amount is {minimalBridgeAmount}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
          2. The cross chain fee may differ as the token price changes
        </Typography.Text>
        {direction === BridgeDirection.In && (
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            3. You will get 400 CKBytes as the capacity of mirror token when you transfer to Nervos Network
          </Typography.Text>
        )}
      </Space>
    </StyledReminderWrapper>
  );
};
