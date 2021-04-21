import { API, XChainNetwork } from '@force-bridge/commons';
import { unimplemented } from 'interfaces/errors';

export function createDummyAPI(): API.ForceBridgeAPIV1 {
  // const httpClient = new Axios(...)

  return {
    getBalance() {
      unimplemented();
    },
    generateBridgeInNervosTransaction() {
      unimplemented();
    },
    generateBridgeOutNervosTransaction() {
      unimplemented();
    },
    getAssetList(): Promise<XChainNetwork['AssetInfo'][]> {
      const assetInfos: XChainNetwork['AssetInfo'][] = [
        {
          network: 'Ethereum',
          ident: { address: '0x' },
          info: {
            shadow: { codeHash: '0x', hashType: 'data', args: '0x' },
            decimals: 8,
            name: 'USDT',
            symbol: 'USDT',
            logoURI: 'https://',
          },
        },
      ];

      return Promise.resolve(assetInfos);
    },
    getBridgeTransactionStatus() {
      unimplemented();
    },
    getBridgeTransactionSummaries() {
      unimplemented();
    },
    sendSignedTransaction() {
      unimplemented();
    },
  };
}
