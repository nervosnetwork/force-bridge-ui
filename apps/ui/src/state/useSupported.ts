// // description of force-bridge supported networks and assets, etc.
// import { XChainNetwork } from '@force-bridge/commons';
// import { sortedUniqBy } from 'lodash';
// import { useQuery, UseQueryResult } from 'react-query';
// import { useForceBridge } from 'state/global';
//
// interface Supported {
//   fromNetwork: string;
//   toNetwork: string;
//   assets: XChainNetwork['AssetInfo'][];
// }
//
// interface ForceBridgeSupported {
//   networks: Supported[];
// }
//
// export function useSupported(nervosNetwork: NetworkName): UseQueryResult<ForceBridgeSupported> {
//   const { api } = useForceBridge();
//
//   return useQuery(
//     ['getSupportedNetworks'],
//     async (): Promise<ForceBridgeSupported> => {
//       const assets = await api.getAssetList();
//       const networkNames = assets.map((info) => info.ident.network);
//
//       const [nervos, ...others] = sortedUniqBy(networkNames, (network) => (network === nervosNetwork ? 0 : 1));
//       if (nervos !== nervosNetwork) throw new Error(`Cannot find ${nervosNetwork} network`);
//
//       // XChain -> Nervos
//       const bridgeInNetworks = others.map<Supported>((net) => ({
//         fromNetwork: net,
//         toNetwork: nervosNetwork,
//         assets: assets.filter((asset) => asset.ident.network === net),
//       }));
//
//       // Nervos -> XChain
//       const bridgeOutNetworks = others.map<Supported>((net) => ({
//         fromNetwork: nervosNetwork,
//         toNetwork: net,
//         assets: assets.filter((asset) => asset.ident.network === nervosNetwork),
//       }));
//
//       return { networks: bridgeInNetworks.concat(bridgeOutNetworks) };
//     },
//   );
// }

import { unimplemented } from 'interfaces/errors';

export function useSupported(): void {
  unimplemented();
}
