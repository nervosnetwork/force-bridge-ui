import { API, Asset } from '@force-bridge/commons';
import { TransactionSummaryWithStatus } from '@force-bridge/commons/lib/types/apiv1';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { HumanizeAmount } from 'components/AssetAmount';
import { StyledCardWrapper } from 'components/Styled';
import { TransactionLink } from 'components/TransactionLink';
import { BridgeDirection, useForceBridge } from 'state';
import { useQueryWithCache } from './useQueryWithCache';

type TransactionWithDetail = TransactionSummaryWithStatus & { key: number; fromDetail: string; toDetail: string };

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
  const { network, direction, nervosModule, signer, api } = useForceBridge();

  const asset = useMemo(() => {
    const isNervosAsset = nervosModule.assetModel.isCurrentNetworkAsset(props.asset);
    if (isNervosAsset) return props.asset.shadow;
    return props.asset;
  }, [nervosModule.assetModel, props.asset]);

  // const filter = useMemo<API.GetBridgeTransactionSummariesPayload | undefined>(() => {
  //   if (!asset || !signer) return undefined;
  //   const userNetwork = direction === BridgeDirection.In ? network : nervosModule.network;
  //   const userIdent = direction === BridgeDirection.In ? signer.identityXChain() : signer.identityNervos();
  //   return { network: network, xchainAssetIdent: asset.ident, user: { network: userNetwork, ident: userIdent } };
  // }, [asset, signer, direction, network, nervosModule.network]);
  //
  // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const query = useQuery(['getBridgeTransactionSummaries', filter], () => api.getBridgeTransactionSummaries(filter!), {
  //   enabled: filter != null,
  //   refetchInterval: 5000,
  // });

  const transactions = useQueryWithCache(asset);

  const columns: ColumnsType<TransactionWithDetail> = [
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
  const historyData = useMemo<TransactionWithDetail[]>(() => {
    if (!transactions) return [];
    return transactions
      .filter((item) => {
        return item.status === historyKind;
      })
      .map((item, index) => {
        const from = item.txSummary.fromAsset.network === 'Nervos' ? '1. burn asset on ' : '1. lock asset on ';
        let to;
        if (!item.txSummary?.toTransaction?.txId) {
          to = '';
        } else {
          to = item.txSummary.toAsset.network === 'Nervos' ? '2. mint asset on ' : '2. unlock asset on ';
        }
        const itemWithKey: TransactionWithDetail = {
          txSummary: item.txSummary,
          status: item.status,
          message: '',
          key: index,
          fromDetail: from,
          toDetail: to,
        };
        return itemWithKey;
      });
  }, [transactions, historyKind]);

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
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <div>
                <TransactionLink
                  network={record.txSummary.fromAsset.network}
                  txId={record.txSummary.fromTransaction.txId}
                >
                  {record.fromDetail + record.txSummary.fromAsset.network}
                </TransactionLink>
              </div>
              {record.txSummary?.toTransaction?.txId && (
                <div>
                  <TransactionLink
                    network={record.txSummary.toAsset.network}
                    txId={record.txSummary.toTransaction.txId}
                  >
                    {record.toDetail + record.txSummary.toAsset.network}
                  </TransactionLink>
                </div>
              )}
            </div>
          ),
        }}
        dataSource={historyData}
        pagination={{ pageSize: 5 }}
      />
    </BridgeHistoryWrapper>
  );
};
