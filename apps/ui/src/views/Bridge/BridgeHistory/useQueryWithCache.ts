import { Asset } from '@force-bridge/commons';
import { API } from '@force-bridge/commons/lib/types';
import { TransactionSummaryWithStatus } from '@force-bridge/commons/lib/types/apiv1';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { BridgeDirection, useForceBridge } from '../../../state';
import { useEthereumStorage } from '../../../xchain';

export function useQueryWithCache(asset: Asset | undefined): TransactionSummaryWithStatus[] | null | undefined {
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
  if (!signer || !asset) return null;
  if (!cachedTransactions) return query.data;
  const filteredTransactions = cachedTransactions.filter(
    (item) =>
      item.sender === signer.identityNervos() &&
      (item.txSummary.fromAsset.ident === asset.ident || item.txSummary.toAsset.ident === asset.ident),
  );

  if (!query.data) return filteredTransactions as TransactionSummaryWithStatus[] | null | undefined;
  const transactions = filteredTransactions.filter((cachedItem) => {
    return !query.data.find(
      (item) => item.txSummary.fromTransaction.txId === cachedItem.txSummary.fromTransaction.txId,
    );
  });
  return query.data
    .concat(transactions)
    .sort(
      (s1, s2) =>
        +new Date(s2.txSummary.toTransaction?.timestamp || s2.txSummary.fromTransaction.timestamp) -
        +new Date(s1.txSummary.toTransaction?.timestamp || s1.txSummary.fromTransaction.timestamp),
    );
}
