import { API, NetworkTypes } from '@force-bridge/commons';
import { unimplemented } from 'interfaces/errors';

let i = 0;

export function createDummyAPI(): API.ForceBridgeAPIV1 {
  // const httpClient = new Axios(...)

  return {
    async getBalance() {
      i += 1;
      if (i % 2 !== 0) {
        return [
          {
            asset: { network: 'Ethereum', ident: { address: '0x1' }, amount: '0' },
            userIdent: { address: '0x1' },
            network: 'Ethereum',
          },
        ];
      }

      return [
        {
          asset: { network: 'Nervos', ident: { codeHash: '0x1', hashType: 'data', args: '0x1' }, amount: '0' },
          userIdent: { codeHash: '0x1', hashType: 'data', args: '0x1' },
          network: 'Nervos',
        },
      ];
    },
    generateBridgeInNervosTransaction() {
      unimplemented();
    },
    generateBridgeOutNervosTransaction() {
      unimplemented();
    },
    getAssetList(): Promise<NetworkTypes['AssetInfo'][]> {
      return Promise.resolve([
        {
          network: 'Ethereum',
          ident: { address: '0x1' },
          info: {
            shadow: { codeHash: '0x1', hashType: 'data', args: '0x1' },
            decimals: 8,
            name: 'USDT',
            symbol: 'USDT',
            logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=010',
          },
        },
        {
          network: 'Nervos',
          ident: { codeHash: '0x1', hashType: 'data', args: '0x1' },
          info: {
            shadow: null,
            decimals: 8,
            name: 'USDT',
            symbol: 'USDT',
            logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=010',
          },
        },
      ]);
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
