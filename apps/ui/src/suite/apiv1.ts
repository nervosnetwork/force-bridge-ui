import { API } from '@force-bridge/commons';
import { unimplemented } from 'interfaces/errors';

// export class DummyForceBridgeAPI implements API.ForceBridgeAPIV1 {
//   generateBridgeInNervosTransaction(
//     _payload: API.GenerateBridgeInTransactionPayload<EthereumNetwork>,
//   ): Promise<API.GenerateTransactionResponse<EthereumNetwork>> {
//     unimplemented();
//   }
//
//   generateBridgeOutNervosTransaction(
//     _payload: API.GenerateBridgeOutNervosTransactionPayload<EthereumNetwork>,
//   ): Promise<API.GenerateTransactionResponse<EthereumNetwork>> {
//     unimplemented();
//   }
//
//   getAssetList(): Promise<XChainNetwork['FungibleInfo'][]> {
//     return Promise.resolve([]);
//   }
//
//   getBalance(
//     _payload: (API.GetBalancePayload<NervosNetwork> | API.GetBalancePayload<EthereumNetwork>)[],
//   ): Promise<(API.GetBalanceResponse<NervosNetwork> | API.GetBalanceResponse<EthereumNetwork>)[]> {
//     unimplemented();
//   }
//
//   getBridgeTransactionSummaries(_userIdent: NervosNetwork['UserInfo']): Promise<API.TransactionSummaryWithStatus[]> {
//     unimplemented();
//   }
//
//   getBridgeTransactionStatus(_txIdent: API.TransactionIdent): Promise<API.TransactionSummaryWithStatus> {
//     unimplemented();
//   }
//
//   sendBridgeInNervosTransaction(_signedTransaction: API.SignedTransactionPayload): Promise<API.TransactionIdent> {
//     unimplemented();
//   }
//
//   sendSignedTransaction(_signedTransaction: API.SignedTransactionPayload): Promise<API.TransactionIdent> {
//     unimplemented();
//   }
// }

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
    async getAssetList() {
      return [
        {
          network: 'Ethereum',
          ident: { address: '0x000000' },
          shadow: { codeHash: '0x...', args: '0x...', hashType: 'type' },
          decimals: 8,
          name: 'USDT',
          symbol: 'USDT',
          logoURI: 'https://',
        },
      ];
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
