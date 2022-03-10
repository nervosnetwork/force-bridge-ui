import { LoadingOutlined } from '@ant-design/icons';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import { CustomizedExclamationIcon } from './styled';
import { HumanizeAmount } from 'components/AssetAmount';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { asserts } from 'errors';

export const BridgeReminder: React.FC = () => {
  const { api, direction, network } = ForceBridgeContainer.useContainer();
  const { asset } = BridgeOperationFormContainer.useContainer();

  // FIXME use network from ForceBridgeContainer if backend support
  const ethereumNetwork = 'Ethereum';
  const query = useQuery(
    ['getMinimalBridgeAmount', { asset: asset?.identity(), network }],
    () => {
      asserts(asset != null && asset.shadow != null);

      if (direction === BridgeDirection.In) {
        return api.getMinimalBridgeAmount({ network: ethereumNetwork, xchainAssetIdent: asset.ident });
      }

      return api.getMinimalBridgeAmount({ network: ethereumNetwork, xchainAssetIdent: asset.shadow.ident });
    },
    {
      enabled: !!asset,
      refetchInterval: false,
      retry: 3,
    },
  );

  if (!asset) return null;

  const minimalBridgeAmount = (
    <>
      {query.data && <HumanizeAmount showSymbol asset={{ ...asset, amount: query.data.minimalAmount }} />}
      {query.isLoading && <LoadingOutlined />}
      {query.isError && <Typography>failed to get data</Typography>}
    </>
  );

  return (
    <>
      <Box display="flex" alignItems="center" flexDirection="column" marginTop={3}>
        <CustomizedExclamationIcon />
        <Box display="flex" alignItems="center">
          <Typography color="text.secondary" textAlign="center" fontWeight={400}>
            1. Minimum amount is
          </Typography>
          {minimalBridgeAmount}
        </Box>
        <Typography color="text.secondary" textAlign="center" fontWeight={400}>
          2. The cross chain fee may differ as the token price changes <br />
          {direction === BridgeDirection.In && (
            <>3. You will get 400 CKBytes as the capacity of mirror token when you transfer to Nervos Network</>
          )}
        </Typography>
      </Box>
    </>
  );
};
