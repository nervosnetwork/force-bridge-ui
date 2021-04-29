import { API, Asset } from '@force-bridge/commons';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { HumanizeAmount } from 'components/AssetAmount';
import { StyledCardWrapper } from 'components/Styled';
import { useForceBridge } from 'state';

const BridgeHistoryWrapper = styled(StyledCardWrapper)`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    background: ${(props) => props.theme.palette.common.white};
    padding: 8px;
    vertical-align: baseline;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px dashed rgb(240, 240, 240);
  }

  .date {
    font-size: 12px;
    text-align: right;
    color: rgba(0, 0, 0, 0.6);
  }
`;

interface BridgeHistoryProps {
  asset: Asset;
}

export const BridgeHistory: React.FC<BridgeHistoryProps> = (props) => {
  const { nervosModule, signer, api } = useForceBridge();

  const asset = useMemo(() => {
    const isNervosAsset = nervosModule.assetModel.isCurrentNetworkAsset(props.asset);
    if (isNervosAsset) return props.asset.shadow;
    return props.asset;
  }, [nervosModule.assetModel, props.asset]);

  const filter = useMemo<API.GetBridgeTransactionSummariesPayload | undefined>(() => {
    if (!asset || !signer) return undefined;
    return { userIdent: signer.identityNervos(), network: asset.network, assetIdent: asset.ident };
  }, [asset, signer]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const query = useQuery(['getBridgeTransactionSummaries', filter], () => api.getBridgeTransactionSummaries(filter!), {
    enabled: filter != null,
    refetchInterval: 3000,
  });

  const columns: ColumnsType<API.TransactionSummaryWithStatus> = [
    {
      title: 'From',
      render: (value, record) => (
        <div>
          <HumanizeAmount showSymbol asset={record.txSummary.fromAsset} />
        </div>
      ),
    },
    {
      title: 'To',
      render: (value, record) => (
        <div>
          <div>
            <HumanizeAmount showSymbol asset={record.txSummary.toAsset} />
          </div>
          <div className="date">
            {dayjs(record.txSummary.toTransaction?.timestamp || record.txSummary.fromTransaction.timestamp).format(
              'YYYY-MM-DD HH:mm:ss',
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <BridgeHistoryWrapper>
      <header>
        <strong>History</strong>
      </header>
      {/*TODO fee calc*/}
      {/*<Row gutter={12} style={{ margin: '16px 0' }}>*/}
      {/*  <Col span={12}>*/}
      {/*    <Button block>Pending</Button>*/}
      {/*  </Col>*/}
      {/*  <Col span={12}>*/}
      {/*    <Button block>Succeed</Button>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
      <Table size="small" columns={columns} dataSource={query.data || []} pagination={{ pageSize: 5 }} />
    </BridgeHistoryWrapper>
  );
};
