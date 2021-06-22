import { Asset } from '@force-bridge/commons';
import { TransactionSummaryWithStatus } from '@force-bridge/commons/lib/types/apiv1';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ExpandRowContent } from './ExpandRowContent';
import { useQueryWithCache } from './useQueryWithCache';
import { HumanizeAmount } from 'components/AssetAmount';
import { StyledCardWrapper } from 'components/Styled';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';

export type TransactionWithKey = TransactionSummaryWithStatus & {
  key: string;
};

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
  const { nervosModule } = ForceBridgeContainer.useContainer();

  const asset = useMemo(() => {
    const isNervosAsset = nervosModule.assetModel.isCurrentNetworkAsset(props.asset);
    if (isNervosAsset) return props.asset.shadow;
    return props.asset;
  }, [nervosModule.assetModel, props.asset]);

  const transactionSummaries = useQueryWithCache(asset);

  const columns: ColumnsType<TransactionWithKey> = [
    {
      title: 'From',
      dataIndex: '',
      render: (value, record) => (
        <div>
          <HumanizeAmount showSymbol asset={record.txSummary.fromAsset} />
        </div>
      ),
    },
    {
      title: 'To',
      dataIndex: '',
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

  const [historyKind, setHistoryKind] = useState<'Pending' | 'Successful'>('Pending');
  const historyData = useMemo<TransactionWithKey[]>(() => {
    if (!transactionSummaries) return [];
    return transactionSummaries
      .filter((item) => {
        return item.status === historyKind;
      })
      .map((item) => {
        const itemWithKey: TransactionWithKey = {
          txSummary: item.txSummary,
          status: item.status,
          message: '',
          key: item.txSummary.fromTransaction.txId,
        };
        return itemWithKey;
      });
  }, [transactionSummaries, historyKind]);

  const [pendingExpandedRowKeys, setPendingExpandedRowKeys] = useState<string[]>();
  const [successExpandedRowKeys, setSuccessExpandedRowKeys] = useState<string[]>();
  useEffect(() => {
    setPendingExpandedRowKeys([]);
    setSuccessExpandedRowKeys([]);
  }, [asset?.ident]);
  const expandedRowKeys = useMemo(() => (historyKind === 'Pending' ? pendingExpandedRowKeys : successExpandedRowKeys), [
    historyKind,
    pendingExpandedRowKeys,
    successExpandedRowKeys,
  ]);
  return (
    <BridgeHistoryWrapper>
      <header>
        <strong>History</strong>
      </header>
      <Row gutter={12} style={{ margin: '16px 0' }}>
        <Col span={12}>
          <Button
            block
            type={historyKind === 'Pending' ? 'primary' : undefined}
            onClick={() => {
              setHistoryKind('Pending');
            }}
          >
            Pending
          </Button>
        </Col>
        <Col span={12}>
          <Button
            block
            type={historyKind === 'Successful' ? 'primary' : undefined}
            onClick={() => {
              setHistoryKind('Successful');
            }}
          >
            Succeed
          </Button>
        </Col>
      </Row>
      <Table
        size="small"
        columns={columns}
        rowKey={(record) => record.txSummary.fromTransaction.txId}
        expandable={{
          expandedRowRender: (record) => <ExpandRowContent record={record} />,
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              if (historyKind === 'Pending') {
                setPendingExpandedRowKeys(
                  pendingExpandedRowKeys
                    ? pendingExpandedRowKeys.concat([record.key.toString()])
                    : [record.key.toString()],
                );
              } else {
                setSuccessExpandedRowKeys(
                  successExpandedRowKeys
                    ? successExpandedRowKeys.concat([record.key.toString()])
                    : [record.key.toString()],
                );
              }
            } else {
              if (pendingExpandedRowKeys && historyKind === 'Pending') {
                setPendingExpandedRowKeys(pendingExpandedRowKeys.filter((item) => item !== record.key.toString()));
              } else if (successExpandedRowKeys && historyKind === 'Successful') {
                setSuccessExpandedRowKeys(successExpandedRowKeys.filter((item) => item !== record.key.toString()));
              }
            }
          },
        }}
        dataSource={historyData}
        pagination={{ pageSize: 5 }}
      />
    </BridgeHistoryWrapper>
  );
};