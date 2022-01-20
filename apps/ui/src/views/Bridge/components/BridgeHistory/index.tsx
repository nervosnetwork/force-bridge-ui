import { Asset } from '@force-bridge/commons';
import { BridgeTransactionStatus } from '@force-bridge/commons/lib/types/apiv1';
import React, { useMemo } from 'react';
import { useQueryWithCache } from './useQueryWithCache';
import { HumanizeAmount } from 'components/AssetAmount';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { History } from './styled';
import { Box, Button, Grid, Typography } from '@mui/material';
import { CheckCircleIcon, ChevronDoubleRightIcon, ClockIcon, SwitchHorizontalIcon } from '@heroicons/react/solid';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import { AssetLogo } from 'components/AssetLogo';

interface BridgeHistoryProps {
  asset: Asset;
  xchainConfirmNumber: number;
  nervosConfirmNumber: number;
}

export const BridgeHistory: React.FC<BridgeHistoryProps> = (props) => {
  const { nervosModule } = ForceBridgeContainer.useContainer();
  const history = useHistory();
  const location = useLocation();

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

  const formatAddress = (address: string) => {
    return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
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

  return (
    <>
      <Typography variant="h1">History</Typography>
      <History textAlign="center">
        {asset ? (
          transactionSummaries?.map((item) => (
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
                <Typography color="text.secondary" variant="body2">
                  {moment(item.txSummary.fromTransaction.timestamp).fromNow()}
                </Typography>
              </Grid>
              <Grid item xs display="flex" justifyContent="end">
                {getStatusIcon(item.status)}
              </Grid>
            </Grid>
          ))
        ) : (
          <>
            <Typography variant="h2" color="text.secondary" marginTop={18}>
              No transfers yet
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
      </History>
    </>
  );
};
