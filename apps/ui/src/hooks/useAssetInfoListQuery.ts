import { Asset, AssetType, eth, FungibleBaseInfo, nervos, NERVOS_NETWORK } from '@force-bridge/commons';
import { useCallback } from 'react';
import { QueryObserverResult, useQuery } from 'react-query';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { asserts, boom } from 'errors';

interface UseAssetInfoState {
  query: QueryObserverResult<{ xchain: Record<string, Asset>; nervos: Record<string, nervos.SUDT> }>;
  infoOf: (asset: AssetType) => FungibleBaseInfo | undefined;
}

export function useAssetInfoListQuery(): UseAssetInfoState {
  const { network, api, xchainModule, direction } = ForceBridgeContainer.useContainer();
  const assetNameConventionPostfix = ` | ${network.toLowerCase().slice(0, 3)}`;
  const current_chain = direction === BridgeDirection.In ? `${network.toLowerCase().slice(0, 3)}` : 'ckb';
  const source_chain = `${network.toLowerCase().slice(0, 3)}`;
  const uanConventionPostfix = `|fb.${source_chain}`;
  const displayNameConventionPostfix = ` (via Forcebridge from ${source_chain.toUpperCase()})`;

  const X = xchainModule.assetModel;
  const query = useQuery(['getAssetAssetWithInfo', { current_chain }], async () => {
    const infoList = await api.getAssetList();

    // xchain asset info: asset.info
    const xchainAssetsInfo = infoList.filter(X.isCurrentNetworkAsset).map<Asset>((assetWithInfo) => {
      // TODO refactor to ModuleRegistry
      if (assetWithInfo.network === 'Ethereum') {
        const ident = assetWithInfo.ident;
        const info = assetWithInfo.info;

        info.uan = `${assetWithInfo.info.symbol}.${source_chain}`;
        info.displayName = `${assetWithInfo.info.symbol}`;

        const sudt = new nervos.SUDT({
          ...info.shadow,
          info: {
            ...assetWithInfo.info,
            shadow: assetWithInfo,
            name: `${assetWithInfo.info.name}${assetNameConventionPostfix}`,
            symbol: `${assetWithInfo.info.symbol}${assetNameConventionPostfix}`,
            uan: `${assetWithInfo.info.symbol}.${current_chain}${uanConventionPostfix}`,
            displayName: `${assetWithInfo.info.symbol}${displayNameConventionPostfix}`,
          },
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

      return boom(`Unknown network asset with ${JSON.stringify(assetWithInfo)}`);
    });

    // xchain asset.shadow
    const nervosAssetsInfo = xchainAssetsInfo.map<nervos.SUDT>((xchainAsset) => {
      asserts(xchainAsset.shadow != null);
      return xchainAsset.shadow;
    });

    return {
      xchain: xchainAssetsInfo.reduce<Record<string, Asset>>(
        (result, asset) => Object.assign(result, { [asset.ident]: asset }),
        {},
      ),
      nervos: nervosAssetsInfo.reduce<Record<string, nervos.SUDT>>(
        (result, asset) => Object.assign(result, { [asset.ident]: asset }),
        {},
      ),
    };
  });

  const infoOf = useCallback(
    (asset: { network: string; ident: string }) => {
      if (!query.data) return;
      if (asset.network === NERVOS_NETWORK) return query.data.nervos[asset.ident]?.info;
      return query.data.xchain[asset.ident]?.info;
    },
    [query],
  );

  return { query, infoOf };
}
