import { BridgeTransactionStatus } from '@force-bridge/commons/lib/types/apiv1';
import { CheckCircleIcon, ChevronDoubleRightIcon, ClockIcon, SwitchHorizontalIcon } from '@heroicons/react/solid';
import {
  Box,
  Button,
  Tooltip,
  Typography,
  TableContainer,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { ExpandRowContent } from './ExpandRowContent';
import { AddressLink } from './components/AddressLink';
import { CustomizedTable, History } from './styled';
import { useQueryWithCache } from './useQueryWithCache';
import { HumanizeAmount } from 'components/AssetAmount';
import { AssetLogo } from 'components/AssetLogo';
import { AssetSelector } from 'components/AssetSelector';
import { NetworkDirectionPreview } from 'components/NetworkDirectionPreview';
import { NetworkDirectionSelector } from 'components/NetworkDirectionSelector';
import { TablePaginationActions } from 'components/TablePaginationActions';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { useAssetQuery } from 'hooks/useAssetQuery';
import { useBridgePath } from 'hooks/useBridgePath';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { useSelectBridgeAsset } from 'views/Bridge/hooks/useSelectBridgeAsset';

interface BridgeHistoryProps {
  xchainConfirmNumber?: number;
  nervosConfirmNumber?: number;
}

export const BridgeHistory: React.FC<BridgeHistoryProps> = (props) => {
  const {
    direction,
    walletConnectStatus,
    nervosModule,
    network,
    supportedNetworks,
    switchBridgeDirection,
    switchNetwork,
  } = ForceBridgeContainer.useContainer();
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const historySelectors = (
    <>
      <NetworkDirectionSelector
        networks={supportedNetworks}
        network={network}
        direction={direction}
        onSelect={({ network, direction }) => {
          switchNetwork(network);
          switchBridgeDirection(direction);
        }}
      />
      <NetworkDirectionPreview
        networks={supportedNetworks}
        network={network}
        direction={direction}
        onSelect={({ network, direction }) => {
          switchNetwork(network);
          switchBridgeDirection(direction);
        }}
      />
      <AssetSelector
        options={assetList}
        rowKey={(asset) => asset.identity()}
        selected={selectedAsset?.identity()}
        onSelect={(_id, asset) => setSelectedAsset(asset)}
        disabled={!isConnected}
      />
    </>
  );

  return (
    <>
      <Typography variant="h1">History</Typography>
      <History textAlign="center">
        {!isConnected && (
          <Box marginBottom={18} marginTop={18}>
            <Typography variant="h2" color="text.secondary">
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
          </Box>
        )}

        {transactionSummaries?.length ? (
          <>
            {historySelectors}
            <TableContainer>
              <CustomizedTable aria-label="custom pagination table">
                <TableBody>
                  {(rowsPerPage > 0
                    ? transactionSummaries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : transactionSummaries
                  ).map((item) => (
                    <>
                      <TableRow key={item.txSummary.fromTransaction.txId}>
                        <TableCell>
                          <Box display="flex">
                            <AssetLogo
                              sx={{ width: 32, height: 32 }}
                              network={item.txSummary.fromAsset.network === 'Nervos' ? 'Nervos' : network}
                              isSmall
                            />
                            <ChevronDoubleRightIcon />
                            <AssetLogo
                              sx={{ width: 32, height: 32 }}
                              network={item.txSummary.toAsset.network === 'Nervos' ? 'Nervos' : network}
                              isSmall
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex">
                            <Typography color="text.secondary" marginRight={0.5} fontWeight={400}>
                              Sender:
                            </Typography>
                            <Typography color="primary.light">
                              <AddressLink
                                address={item.txSummary.sender}
                                network={item.txSummary.fromAsset.network === 'Nervos' ? 'Nervos' : network}
                              />
                            </Typography>
                          </Box>
                          <Box display="flex">
                            <Typography color="text.secondary" marginRight={0.5} fontWeight={400}>
                              Recipient:
                            </Typography>
                            <Typography color="primary.light">
                              <AddressLink
                                address={item.txSummary.recipient}
                                network={item.txSummary.toAsset.network === 'Nervos' ? 'Nervos' : network}
                              />
                            </Typography>
                          </Box>
                          <Box display="flex">
                            <Typography color="text.secondary" marginRight={0.5} fontWeight={400}>
                              Amount:
                            </Typography>
                            <HumanizeAmount
                              color="primary.light"
                              marginRight={1}
                              showSymbol
                              asset={item.txSummary.toAsset}
                            />
                            <AssetLogo
                              sx={{ width: 20, height: 20 }}
                              network={item.txSummary.toAsset.network === 'Nervos' ? 'Nervos' : network}
                              isSmall
                            />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          <Typography
                            color={
                              item.status === BridgeTransactionStatus.Pending ? 'text.secondary' : 'secondary.main'
                            }
                            variant="body2"
                          >
                            {item.status}
                          </Typography>
                          <Tooltip title={dayjs(item.txSummary.fromTransaction.timestamp).format('YYYY-MM-DD HH:mm')}>
                            <Typography color="text.secondary" variant="body2">
                              {moment(item.txSummary.fromTransaction.timestamp).fromNow()}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{getStatusIcon(item.status)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <ExpandRowContent
                            record={item}
                            nervosConfirmNumber={props.nervosConfirmNumber}
                            xchainConfirmNumber={props.xchainConfirmNumber}
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      count={transactionSummaries.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          'aria-label': 'rows per page',
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </CustomizedTable>
            </TableContainer>
          </>
        ) : (
          <Box marginTop={9} marginBottom={9} sx={!isConnected ? { display: 'none' } : null}>
            {historySelectors}
            <Typography variant="h2" color="text.secondary">
              {selectedAsset ? 'No results' : 'Please select an asset first'}.
            </Typography>
          </Box>
        )}
      </History>
    </>
  );
};
