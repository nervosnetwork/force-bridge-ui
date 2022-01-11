import { Asset, utils } from '@force-bridge/commons';
import { BridgeTransactionStatus, TransactionSummaryWithStatus } from '@force-bridge/commons/lib/types/apiv1';
import { Button, Col, Row, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ExpandRowContent } from './ExpandRowContent';
import { useQueryWithCache } from './useQueryWithCache';
import { HumanizeAmount } from 'components/AssetAmount';
import { NetworkIcon } from 'components/Network';
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
  xchainConfirmNumber: number;
  nervosConfirmNumber: number;
}

export const BridgeHistory: React.FC<BridgeHistoryProps> = (props) => {
  const { nervosModule, network } = ForceBridgeContainer.useContainer();

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
        <div style={{ width: '120px' }}>
          <NetworkIcon network={record.txSummary.fromAsset.network === 'Nervos' ? 'Nervos' : network} />
          &nbsp;
          <HumanizeAmount showSymbol asset={record.txSummary.fromAsset} />
        </div>
      ),
    },
    {
      title: 'To',
      dataIndex: '',
      render: (value, record) => (
        <div style={{ width: '120px' }}>
          <div>
            <NetworkIcon network={record.txSummary.toAsset.network === 'Nervos' ? 'Nervos' : network} />
            &nbsp;
            <HumanizeAmount showSymbol asset={record.txSummary.toAsset} />
            {record.status === BridgeTransactionStatus.Failed && (
              <Typography.Text type="danger"> (error)</Typography.Text>
            )}
          </div>
          <div className="date">
            {dayjs(record.txSummary.toTransaction?.timestamp || record.txSummary.fromTransaction.timestamp).format(
              'YYYY-MM-DD HH:mm',
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
        if (historyKind === 'Pending') {
          return item.status === 'Pending' || item.status === 'Failed';
        }
        return item.status === 'Successful';
      })
      .map((item) => {
        const itemWithKey: TransactionWithKey = {
          txSummary: item.txSummary,
          status: item.status,
          message: utils.hasProp(item, 'message') ? item.message : '',
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
          expandedRowRender: (record) => (
            <ExpandRowContent
              record={record}
              nervosConfirmNumber={props.nervosConfirmNumber}
              xchainConfirmNumber={props.xchainConfirmNumber}
            />
          ),
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
