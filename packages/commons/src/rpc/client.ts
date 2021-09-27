import { ethers } from 'ethers';
import { JSONRPCClient, JSONRPCRequest } from 'json-rpc-2.0';
import fetch from 'node-fetch';
import { API, NetworkBase, NetworkTypes, RequiredAsset } from '../types';

export class ForceBridgeAPIV1Handler implements API.ForceBridgeAPIV1 {
  client: JSONRPCClient;

  constructor(forceBridgeUrl: string) {
    this.client = new JSONRPCClient((jsonRPCRequest: JSONRPCRequest) =>
      fetch(forceBridgeUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(jsonRPCRequest),
      }).then((response) => {
        if (response.status === 200) {
          // Use client.receive when you received a JSON-RPC response.
          return response.json().then((jsonRPCResponse) => this.client.receive(jsonRPCResponse));
        } else if (jsonRPCRequest.id !== undefined) {
          return Promise.reject(new Error(response.statusText));
        } else {
          return Promise.reject(new Error('request id undefined'));
        }
      }),
    );
  }

  getMinimalBridgeAmount(payload: API.GetMinimalBridgeAmountPayload): Promise<API.GetMinimalBridgeAmountResponse> {
    return Promise.resolve(this.client.request('getMinimalBridgeAmount', payload));
  }

  getBridgeInNervosBridgeFee(
    payload: API.GetBridgeInNervosBridgeFeePayload,
  ): Promise<API.GetBridgeInNervosBridgeFeeResponse> {
    return Promise.resolve(this.client.request('getBridgeInNervosBridgeFee', payload));
  }

  getBridgeOutNervosBridgeFee(
    payload: API.GetBridgeOutNervosBridgeFeePayload,
  ): Promise<API.GetBridgeOutNervosBridgeFeeResponse> {
    return Promise.resolve(Promise.resolve(this.client.request('getBridgeOutNervosBridgeFee', payload)));
  }

  async generateBridgeInNervosTransaction<T extends NetworkTypes>(
    payload: API.GenerateBridgeInTransactionPayload,
  ): Promise<API.GenerateTransactionResponse<T>> {
    const result = await this.client.request('generateBridgeInNervosTransaction', payload);
    switch (result.network) {
      case 'Ethereum':
        {
          const rawTx = result.rawTransaction;
          rawTx.value = ethers.BigNumber.from(rawTx.value?.hex ?? 0);
          result.rawTransaction = rawTx;
        }
        break;
      default:
        //TODO add other chains
        Promise.reject(new Error('not yet'));
    }
    return result;
  }

  async generateBridgeOutNervosTransaction<T extends NetworkTypes>(
    payload: API.GenerateBridgeOutNervosTransactionPayload,
  ): Promise<API.GenerateTransactionResponse<T>> {
    return this.client.request('generateBridgeOutNervosTransaction', payload);
  }

  async sendSignedTransaction<T extends NetworkBase>(
    payload: API.SignedTransactionPayload<T>,
  ): Promise<API.TransactionIdent> {
    return this.client.request('sendSignedTransaction', payload);
  }

  async getBridgeTransactionStatus(
    payload: API.GetBridgeTransactionStatusPayload,
  ): Promise<API.GetBridgeTransactionStatusResponse> {
    return this.client.request('getBridgeTransactionStatus', payload);
  }

  async getBridgeTransactionSummaries(
    payload: API.GetBridgeTransactionSummariesPayload,
  ): Promise<API.TransactionSummaryWithStatus[]> {
    return await this.client.request('getBridgeTransactionSummaries', payload);
  }

  async getAssetList(name?: string): Promise<RequiredAsset<'info'>[]> {
    let param = { asset: name };
    if (name == undefined) {
      param = { asset: 'all' };
    }
    return this.client.request('getAssetList', param);
  }

  async getBalance(payload: API.GetBalancePayload): Promise<API.GetBalanceResponse> {
    return this.client.request('getBalance', payload);
  }

  async getBridgeConfig(): Promise<API.GetConfigResponse> {
    return this.client.request('getBridgeConfig');
  }
}
