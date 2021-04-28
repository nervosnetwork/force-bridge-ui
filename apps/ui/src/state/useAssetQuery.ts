import { Asset, eth, nervos } from '@force-bridge/commons';
import { QueryObserverResult, useQuery } from 'react-query';
import { boom } from 'interfaces/errors';
import { useForceBridge } from 'state/global';
import { asserts } from 'utils';

type Assets = { xchain: Asset[]; nervos: nervos.SUDT[] };

export function useAssetQuery(): QueryObserverResult<Assets> {
  const { api, direction, network, signer, xchainModule } = useForceBridge();

  const X = xchainModule.assetModel;

  const { data: infos } = useQuery(['getAssetAssetWithInfo', { network }], async () => {
    const infoList = await api.getAssetList();

    // xchain asset info: asset.info
    const xchainAssetsInfo = infoList.filter(X.isCurrentNetworkAsset).map<Asset>((assetWithInfo) => {
      // TODO refactor to ModuleRegistry
      if (assetWithInfo.network === 'Ethereum') {
        const ident = assetWithInfo.ident;
        const info = assetWithInfo.info;

        const sudt = new nervos.SUDT({
          info: {
            ...assetWithInfo.info,
            shadow: assetWithInfo,
            name: `ck${assetWithInfo.info.name}`,
            symbol: `ck${assetWithInfo.info.symbol}`,
          },
          ...info.shadow,
        });

        let xchainAsset: Asset;
        if (X.isDerivedAsset(assetWithInfo)) {
          xchainAsset = new eth.ERC20({ ident, info, shadow: sudt });
        } else if (X.isNativeAsset(assetWithInfo)) {
          xchainAsset = new eth.Ether({ info, shadow: sudt });
        } else {
          boom(`asset is not valid ${JSON.stringify(assetWithInfo)}`);
        }

        sudt.setShadow(xchainAsset);

        return xchainAsset;
      }

      return boom('');
    });

    // xchain asset.shadow
    const nervosAssetsInfo = xchainAssetsInfo.map<nervos.SUDT>((xchainAsset) => {
      asserts(xchainAsset.shadow != null);
      return xchainAsset.shadow;
    });

    return { xchain: xchainAssetsInfo, nervos: nervosAssetsInfo };
  });

  return useQuery(
    ['getAssetBalance', { network, direction }],
    async (): Promise<Assets> => {
      if (!signer) boom('signer is not found when fetching balance');
      if (!infos) boom('asset list is not loaded');

      const infoToBalancePayload = (userIdent: string) => ({ network, ident }: { network: string; ident: string }) => ({
        network,
        userIdent,
        assetIdent: ident,
      });

      const xchainBalances = await api.getBalance(infos.xchain.map(infoToBalancePayload(signer.identityXChain())));
      const nervosBalances = await api.getBalance(infos.nervos.map(infoToBalancePayload(signer.identityNervos())));

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
