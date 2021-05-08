import { API, Asset } from '@force-bridge/commons';
import { Button, Col, Row, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { TransactionLink } from '../../../components/TransactionLink';
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
    refetchInterval: 5000,
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
            <Tooltip
              title={
                <div>
                  <div>
                    <TransactionLink
                      network={record.txSummary.fromAsset.network}
                      txId={record.txSummary.fromTransaction.txId}
                    >
                      Explore {record.txSummary.fromAsset.network} Tx
                    </TransactionLink>
                  </div>
                  {record.txSummary?.toTransaction?.txId && (
                    <div>
                      <TransactionLink
                        network={record.txSummary.toAsset.network}
                        txId={record.txSummary.toTransaction.txId}
                      >
                        Explore {record.txSummary.toAsset.network} Tx
                      </TransactionLink>
                    </div>
                  )}
                </div>
              }
            >
              {dayjs(record.txSummary.toTransaction?.timestamp || record.txSummary.fromTransaction.timestamp).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  const [historyKind, setHistoryKind] = useState<'Pending' | 'Successful'>('Pending');
  const historyData = useMemo(() => {
    if (!query.data) return [];
    return query.data.filter((item) => {
      return item.status === historyKind;
    });
  }, [query, historyKind]);

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
                  Explore {record.txSummary.fromAsset.network} Tx
                </TransactionLink>
              </div>
              {record.txSummary?.toTransaction?.txId && (
                <div>
                  <TransactionLink
                    network={record.txSummary.toAsset.network}
                    txId={record.txSummary.toTransaction.txId}
                  >
                    Explore {record.txSummary.toAsset.network} Tx
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
