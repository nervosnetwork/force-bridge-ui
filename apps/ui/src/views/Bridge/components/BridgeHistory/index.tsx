import { Asset } from '@force-bridge/commons';
import { BridgeTransactionStatus } from '@force-bridge/commons/lib/types/apiv1';
import React, { useMemo } from 'react';
import { useQueryWithCache } from './useQueryWithCache';
import { HumanizeAmount } from 'components/AssetAmount';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { History } from './styled';
import { Box, Button, Grid, Tooltip, Typography } from '@mui/material';
import { CheckCircleIcon, ChevronDoubleRightIcon, ClockIcon, SwitchHorizontalIcon } from '@heroicons/react/solid';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import { AssetLogo } from 'components/AssetLogo';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { AssetSelector } from 'components/AssetSelector';
import { useAssetQuery } from 'hooks/useAssetQuery';
import { useSelectBridgeAsset } from 'views/Bridge/hooks/useSelectBridgeAsset';
import dayjs from 'dayjs';
import { ExpandRowContent } from './ExpandRowContent';
import { formatAddress } from 'utils';

interface BridgeHistoryProps {
  asset?: Asset;
  xchainConfirmNumber?: number;
  nervosConfirmNumber?: number;
}

export const BridgeHistory: React.FC<BridgeHistoryProps> = (props) => {
  const { nervosModule, walletConnectStatus, direction } = ForceBridgeContainer.useContainer();
  const history = useHistory();
  const location = useLocation();
  const query = useAssetQuery();
  const { selectedAsset, setSelectedAsset } = useSelectBridgeAsset();
  const isConnected = walletConnectStatus === ConnectStatus.Connected;

  const asset = useMemo(() => {
    if (!props.asset) return;
    const isNervosAsset = nervosModule.assetModel.isCurrentNetworkAsset(props.asset);
    if (isNervosAsset) return props.asset.shadow;
    return props.asset;
  }, [nervosModule.assetModel, props.asset]);

  const transactionSummaries = useQueryWithCache(asset);
  const setParams = (isBridge: string) => {
    const params = new URLSearchParams(location.search);
    params.set('isBridge', isBridge);
    history.replace({ search: params.toString() });
  };

  moment.locale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: '1s',
      ss: '%ss',
      m: '1m',
      mm: '%dm',
      h: '1hr',
      hh: '%dhr',
      d: '1d',
      dd: '%dd',
      M: '1M',
      MM: '%dM',
      y: '1Y',
      yy: '%dY',
    },
  });

  const getStatusIcon = (status: BridgeTransactionStatus) => {
    let result;
    switch (status) {
      case BridgeTransactionStatus.Successful:
        result = <CheckCircleIcon className="status-icon-green" />;
        break;
      case BridgeTransactionStatus.Pending:
        result = <ClockIcon className="status-icon" />;
        break;
    }
    return result;
  };

  const assetList = useMemo(() => {
    if (!query.data) return [];
    if (direction === BridgeDirection.In) return query.data.xchain;
    return query.data.nervos;
  }, [direction, query.data]);

  return (
    <>
      <Typography variant="h1">History</Typography>
      <History textAlign="center">
        {asset ? (
          transactionSummaries?.map((item, index) => (
            <>
              <Grid container key={item.txSummary.fromTransaction.txId}>
                <Grid item xs display="flex">
                  <AssetLogo sx={{ width: 32, height: 32 }} network={item.txSummary.fromAsset.network} />
                  <ChevronDoubleRightIcon />
                  <AssetLogo sx={{ width: 32, height: 32 }} network={item.txSummary.toAsset.network} />
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex">
                    <Typography color="text.secondary" marginRight={0.5} fontWeight={400}>
                      To
                    </Typography>
                    <Typography color="primary.light">{formatAddress(item.txSummary.toAsset.ident)}</Typography>
                  </Box>
                  <Box display="flex">
                    <AssetLogo sx={{ width: 20, height: 20 }} network={item.txSummary.fromAsset.network} />{' '}
                    <HumanizeAmount showSymbol asset={item.txSummary.toAsset} />
                  </Box>
                </Grid>
                <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography
                    color={item.status === BridgeTransactionStatus.Pending ? 'text.secondary' : 'secondary.main'}
                    variant="body2"
                  >
                    {item.status}
                  </Typography>
                  <Tooltip title={dayjs(item.txSummary.fromTransaction.timestamp).format('YYYY-MM-DD HH:mm')}>
                    <Typography color="text.secondary" variant="body2">
                      {moment(item.txSummary.fromTransaction.timestamp).fromNow()}
                    </Typography>
                  </Tooltip>
                </Grid>
                <Grid item xs={1} display="flex" justifyContent="end">
                  {getStatusIcon(item.status)}
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-end" gap="10px" marginTop={0.5}>
                  <ExpandRowContent
                    record={item}
                    nervosConfirmNumber={props.nervosConfirmNumber}
                    xchainConfirmNumber={props.xchainConfirmNumber}
                  />
                </Grid>
              </Grid>
            </>
          ))
        ) : (
          <>
            {isConnected ? (
              <>
                <Typography variant="h2" color="text.secondary" marginTop={18}>
                  Please select an asset first.
                </Typography>
                <AssetSelector
                  options={assetList}
                  rowKey={(asset) => asset.identity()}
                  selected={selectedAsset?.identity()}
                  onSelect={(_id, asset) => setSelectedAsset(asset)}
                />
              </>
            ) : (
              <>
                <Typography variant="h2" color="text.secondary" marginTop={18}>
                  You need to connect wallet first.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setParams('true')}
                  startIcon={<SwitchHorizontalIcon />}
                >
                  Transfer Now
                </Button>
              </>
            )}
          </>
        )}
      </History>
    </>
  );
};
