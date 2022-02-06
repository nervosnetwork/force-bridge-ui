import { BridgeTransactionStatus } from '@force-bridge/commons/lib/types/apiv1';
import { CheckCircleIcon, ChevronDoubleRightIcon, ClockIcon, SwitchHorizontalIcon } from '@heroicons/react/solid';
import { Box, Button, Grid, Tooltip, Typography } from '@mui/material';

import dayjs from 'dayjs';
import moment from 'moment';
import React, { useMemo } from 'react';
import { ExpandRowContent } from './ExpandRowContent';
import { History } from './styled';
import { useQueryWithCache } from './useQueryWithCache';
import { HumanizeAmount } from 'components/AssetAmount';
import { AssetLogo } from 'components/AssetLogo';
import { AssetSelector } from 'components/AssetSelector';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { useAssetQuery } from 'hooks/useAssetQuery';
import { useBridgePath } from 'hooks/useBridgePath';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { formatAddress } from 'utils';
import { useSelectBridgeAsset } from 'views/Bridge/hooks/useSelectBridgeAsset';

interface BridgeHistoryProps {
  xchainConfirmNumber?: number;
  nervosConfirmNumber?: number;
}

export const BridgeHistory: React.FC<BridgeHistoryProps> = (props) => {
  const { direction, walletConnectStatus, nervosModule } = ForceBridgeContainer.useContainer();
  const query = useAssetQuery();
  const { selectedAsset, setSelectedAsset } = useSelectBridgeAsset();
  const { setPath } = useBridgePath();
  const isConnected = walletConnectStatus === ConnectStatus.Connected;

  const asset = useMemo(() => {
    if (selectedAsset) {
      const isNervosAsset = nervosModule.assetModel.isCurrentNetworkAsset(selectedAsset);
      if (isNervosAsset) return selectedAsset?.shadow;
    }
    return selectedAsset;
  }, [nervosModule.assetModel, selectedAsset]);

  const transactionSummaries = useQueryWithCache(asset);

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
        {!isConnected && (
          <>
            <Typography variant="h2" color="text.secondary" marginTop={18}>
              You need to connect wallet first.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setPath('transfer')}
              startIcon={<SwitchHorizontalIcon />}
            >
              Transfer Now
            </Button>
          </>
        )}
        {transactionSummaries?.length ? (
          <>
            <AssetSelector
              options={assetList}
              rowKey={(asset) => asset.identity()}
              selected={selectedAsset?.identity()}
              onSelect={(_id, asset) => setSelectedAsset(asset)}
              disabled={false}
            />
            {transactionSummaries?.map((item) => (
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
            ))}
          </>
        ) : (
          <Box marginTop={18} marginBottom={18} sx={!isConnected ? { display: 'none' } : null}>
            <AssetSelector
              options={assetList}
              rowKey={(asset) => asset.identity()}
              selected={selectedAsset?.identity()}
              onSelect={(_id, asset) => setSelectedAsset(asset)}
              disabled={!isConnected}
            />
            <Typography variant="h2" color="text.secondary">
              {selectedAsset ? 'No results' : 'Please select an asset first'}.
            </Typography>
          </Box>
        )}
      </History>
    </>
  );
};
