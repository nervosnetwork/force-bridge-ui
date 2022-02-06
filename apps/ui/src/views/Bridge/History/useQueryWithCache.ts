import { Asset } from '@force-bridge/commons';
import { API } from '@force-bridge/commons/lib/types';
import { TransactionSummaryWithStatus } from '@force-bridge/commons/lib/types/apiv1';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { useSentTransactionStorage } from 'hooks/useSentTransactionStorage';

export function useQueryWithCache(asset: Asset | undefined): TransactionSummaryWithStatus[] | null | undefined {
  const { signer, direction, nervosModule, api, network } = ForceBridgeContainer.useContainer();
  // FIXME use network from ForceBridgeContainer if backend support
  const ethereumNetwork = 'Ethereum';
  const filter = useMemo<API.GetBridgeTransactionSummariesPayload | undefined>(() => {
    if (!asset || !signer) return undefined;
    const userNetwork = direction === BridgeDirection.In ? ethereumNetwork : nervosModule.network;
    const userIdent = direction === BridgeDirection.In ? signer.identityXChain() : signer.identityNervos();
    return {
      network: ethereumNetwork,
      xchainAssetIdent: asset.ident,
      user: { network: userNetwork, ident: userIdent },
    };
  }, [asset, signer, direction, ethereumNetwork, nervosModule.network]);
  const signerIdent = useMemo(
    () => (direction === BridgeDirection.In ? signer?.identityXChain() : signer?.identityNervos()),
    [direction, signer],
  );

  const query = useQuery(
    ['getBridgeTransactionSummaries', filter, network],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => api.getBridgeTransactionSummaries(filter!),
    {
      enabled: filter != null,
      refetchInterval: 5000,
    },
  );
  const { transactions: cachedTransactions, removeTransactions } = useSentTransactionStorage();
  if (!signer || !asset) return null;
  if (!cachedTransactions) return query.data;
  const cachedTransactionsOfSender = cachedTransactions.filter(
    (item) =>
      item.sender === signerIdent &&
      ((item.txSummary.fromAsset.ident === asset.ident && item.txSummary.toAsset.ident === asset.shadow?.ident) ||
        (item.txSummary.toAsset.ident === asset.ident && item.txSummary.fromAsset.ident === asset.shadow?.ident)),
  );

  if (!query.data) return cachedTransactionsOfSender as TransactionSummaryWithStatus[] | null | undefined;
  const backendCoveredTransactions: string[] = [];
  const availableCachedTransactions = cachedTransactionsOfSender.filter((cachedItem) => {
    if (query.data.find((item) => item.txSummary.fromTransaction.txId === cachedItem.txSummary.fromTransaction.txId)) {
      backendCoveredTransactions.push(cachedItem.txSummary.fromTransaction.txId);
      return false;
    }
    return true;
  });
  removeTransactions(backendCoveredTransactions);
  return query.data
    .concat(availableCachedTransactions)
    .sort(
      (s1, s2) =>
        +new Date(s2.txSummary.toTransaction?.timestamp || s2.txSummary.fromTransaction.timestamp) -
        +new Date(s1.txSummary.toTransaction?.timestamp || s1.txSummary.fromTransaction.timestamp),
    );
}
