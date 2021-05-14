import { Asset } from '@force-bridge/commons';
import { API } from '@force-bridge/commons/lib/types';
import { TransactionSummaryWithStatus } from '@force-bridge/commons/lib/types/apiv1';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { BridgeDirection, useForceBridge } from '../../../state';
import { useEthereumStorage } from '../../../xchain';

export function useQueryWithCache(asset: Asset | undefined): TransactionSummaryWithStatus[] | null {
  const { signer, direction, network, nervosModule, api } = useForceBridge();
  const filter = useMemo<API.GetBridgeTransactionSummariesPayload | undefined>(() => {
    if (!asset || !signer) return undefined;
    const userNetwork = direction === BridgeDirection.In ? network : nervosModule.network;
    const userIdent = direction === BridgeDirection.In ? signer.identityXChain() : signer.identityNervos();
    return { network: network, xchainAssetIdent: asset.ident, user: { network: userNetwork, ident: userIdent } };
  }, [asset, signer, direction, network, nervosModule.network]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const query = useQuery(['getBridgeTransactionSummaries', filter], () => api.getBridgeTransactionSummaries(filter!), {
    enabled: filter != null,
    refetchInterval: 5000,
  });

  const { transactions: cachedTransactions } = useEthereumStorage();
  if (!query.data || !cachedTransactions) return cachedTransactions;
  const filteredTransactions = cachedTransactions.filter((cachedItem) => {
    return !query.data.find(
      (item) => item.txSummary.fromTransaction.txId === cachedItem.txSummary.fromTransaction.txId,
    );
  });
  return query.data.concat(filteredTransactions);
}
