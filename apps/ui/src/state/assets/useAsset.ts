import { FullFungibleAssetTypes, NERVOS_NETWORK, NervosNetwork } from '@force-bridge/commons';
import { QueryObserverResult, useQuery } from 'react-query';
import { boom } from 'interfaces/errors';
import { useForceBridge } from 'state/global';

type Assets = { xchain: FullFungibleAssetTypes[]; nervos: FullFungibleAssetTypes<NervosNetwork>[] };

export interface UseAssetInfoQuery {
  query: QueryObserverResult<Assets>;
}

export function useAsset(): UseAssetInfoQuery {
  const { api, direction, network, signer, nervosModule, xchainModule } = useForceBridge();

  const N = nervosModule.assetModel;
  const X = xchainModule.assetModel;

  const { data: infos } = useQuery(['getAssetAssetWithInfo', { network }], async () => {
    const infoList = await api.getAssetList();

    // xchain asset info: asset.info
    const xchainAssetsInfo = infoList.filter(X.isCurrentNetworkAsset);

    // xchain asset.shadow
    const nervosAssetsInfo = xchainAssetsInfo.map<NervosNetwork['FungibleInfo']>((xchainAsset) => {
      const shadowIdent = xchainAsset.info.shadow;

      const nervosInfo = infoList.find((info) => {
        if (!N.isDerivedAsset(info)) return false;

        const assetLike = { ident: shadowIdent, network: NERVOS_NETWORK };
        if (!N.isDerivedAsset(assetLike)) return false;

        return N.equalsFungibleAsset(info, assetLike);
      });
      if (!nervosInfo) boom(`Cannot find shadow asset of ${JSON.stringify(xchainAsset)}`);
      return nervosInfo as NervosNetwork['FungibleInfo'];
    });

    return { xchain: xchainAssetsInfo, nervos: nervosAssetsInfo };
  });

  const query = useQuery(
    ['getAssetBalance', { network, direction }],
    async (): Promise<Assets> => {
      if (!signer) boom('signer is not found when fetching balance');
      if (!infos) boom('asset list is not loaded');

      const infoToBalancePayload = ({ network, ident }: { network: string; ident: unknown }) => ({
        network,
        assetIdent: ident,
        userIdent: signer.identOrigin(),
      });

      const xchainBalances = await api.getBalance(infos.xchain.map(infoToBalancePayload));
      const nervosBalances = await api.getBalance(infos.nervos.map(infoToBalancePayload));

      return {
        xchain: xchainBalances.map<FullFungibleAssetTypes>(({ asset }, i) => ({
          ...asset,
          info: infos.xchain[i].info,
        })),
        nervos: nervosBalances.map<FullFungibleAssetTypes<NervosNetwork>>(({ asset }, i) => ({
          amount: asset.amount,
          network: NERVOS_NETWORK,
          info: infos.nervos[i].info,
          ident: asset.ident as NervosNetwork['FungibleAssetIdent'],
        })),
      };
    },
    { enabled: signer != null && infos != null },
  );

  return { query };
}
