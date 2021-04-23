import { API } from '@force-bridge/commons';
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
            ident: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            amount: '200000000000000',
            network: 'Ethereum',
          },
        ];
      }

      return [
        {
          ident: 'ckt1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          amount: '200000000000000',
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
    getAssetList() {
      return Promise.resolve([
        {
          network: 'Ethereum',
          ident: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          info: {
            shadow: { network: 'Nervos', ident: 'ckt1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
            decimals: 8,
            name: 'USDT',
            symbol: 'USDT',
            logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=010',
          },
        },
        {
          network: 'Nervos',
          ident: 'ckt1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          info: {
            shadow: { network: 'Ethereum', ident: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
            decimals: 8,
            name: 'ckUSDT',
            symbol: 'ckUSDT',
            logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=010',
          },
        },
      ]);
    },
    getBridgeTransactionStatus() {
      unimplemented();
    },
    getBridgeTransactionSummaries() {
      const summary0: API.TransactionSummaryWithStatus = {
        txSummary: {
          fromTransaction: { txId: '0x', timestamp: Date.now() },
          toTransaction: { txId: '0x', timestamp: Date.now() },
          fromAsset: { network: 'Nervos', ident: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', amount: '10000' },
          toAsset: { network: 'Ethereum', ident: 'ckt1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', amount: '20000' },
        },
        status: API.BridgeTransactionStatus.Successful,
      };

      return Promise.resolve([summary0]);
    },
    sendSignedTransaction() {
      unimplemented();
    },
  };
}
