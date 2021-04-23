import { API } from '@force-bridge/commons';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React from 'react';
import styled from 'styled-components';
import { AssetAmount } from 'components/AssetAmount';
import { StyledCardWrapper } from 'components/Styled';

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
`;

export const BridgeHistory: React.FC = () => {
  // TODO useTransactionSummaries
  const dataSources: API.TransactionSummary[] = [];
  const columns: ColumnsType<API.TransactionSummary> = [
    { title: 'From', render: (value, record) => <AssetAmount amount={record.txSummary.fromAsset.amount} /> },
    {
      title: 'To',
      render: (value, record) => (
        <div>
          <div>
            <AssetAmount amount={record.txSummary.toAsset.amount} />
          </div>
          <div>
            {new Date(record.txSummary.toTransaction?.timestamp || record.txSummary.fromTransaction.timestamp).toJSON()}
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
      <Row gutter={12} style={{ margin: '16px 0' }}>
        <Col span={12}>
          <Button block>Pending</Button>
        </Col>
        <Col span={12}>
          <Button block>Succeed</Button>
        </Col>
      </Row>
      <Table size="small" columns={columns} dataSource={dataSources} />
    </BridgeHistoryWrapper>
  );
};
