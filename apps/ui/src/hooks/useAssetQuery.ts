import { Asset, nervos } from '@force-bridge/commons';
import { useMemo } from 'react';
import { QueryObserverResult, useQuery } from 'react-query';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { useAssetInfoListQuery } from 'hooks/useAssetInfoListQuery';
import { useSignerSelector } from 'hooks/useSignerSelector';

type Assets = { xchain: Asset[]; nervos: nervos.SUDT[] };

export function useAssetQuery(): QueryObserverResult<Assets> {
  const { api, direction, network } = ForceBridgeContainer.useContainer();
  const { query } = useAssetInfoListQuery();
  const signer = useSignerSelector();

  const infos = useMemo(() => {
    if (!query.data) return;
    return { xchain: Object.values(query.data.xchain), nervos: Object.values(query.data.nervos) };
  }, [query.data]);

  return useQuery(
    ['getAssetBalance', { network, direction, signer: signer?.identity }],
    async (): Promise<Assets> => {
      if (!signer) boom('signer is not found when fetching balance');
      if (!infos) boom('asset list is not loaded');

      const infoToBalancePayload = (userIdent: string) => ({ network, ident }: { network: string; ident: string }) => ({
        network,
        userIdent,
        assetIdent: ident,
      });

      const xchainBalances = await api.getBalance(infos.xchain.map(infoToBalancePayload(signer.identityXChain)));
      const nervosBalances = await api.getBalance(infos.nervos.map(infoToBalancePayload(signer.identityNervos)));

      return {
        xchain: xchainBalances.map<Asset>((balance, i) => {
          const asset = infos.xchain[i];
          asset.setAmount(balance.amount);
          return asset;
        }),
        nervos: nervosBalances.map<nervos.SUDT>((balance, i) => {
          const asset = infos.nervos[i];
          asset.setAmount(balance.amount);
          return asset;
        }),
      };
    },
    { enabled: signer != null && infos != null },
  );
}
