import { API, RequiredAsset, NetworkBase, NetworkTypes } from '../types';
import { JSONRPCClient, JSONRPCRequest } from 'json-rpc-2.0';
import { ethers } from 'ethers';
import fetch from 'node-fetch';

// TODO use setting config url
const FORCE_BRIDGE_URL = 'http://localhost:8080/force-bridge/api/v1';

const client: JSONRPCClient = new JSONRPCClient((jsonRPCRequest: JSONRPCRequest) =>
  fetch(FORCE_BRIDGE_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(jsonRPCRequest),
  }).then((response) => {
    if (response.status === 200) {
      // Use client.receive when you received a JSON-RPC response.
      return response.json().then((jsonRPCResponse) => client.receive(jsonRPCResponse));
    } else if (jsonRPCRequest.id !== undefined) {
      return Promise.reject(new Error(response.statusText));
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }),
);

export class ForceBridgeAPIV1Handler implements API.ForceBridgeAPIV1 {
  client: JSONRPCClient;
  constructor() {
    this.client = client;
  }
  async generateBridgeInNervosTransaction<T extends NetworkTypes>(
    payload: API.GenerateBridgeInTransactionPayload,
  ): Promise<API.GenerateTransactionResponse<T>> {
    const result = await this.client.request('generateBridgeInNervosTransaction', payload);
    switch (result.network) {
      case 'Ethereum':
        const rawTx = result.rawTransaction;
        rawTx.value = ethers.BigNumber.from(rawTx.value.hex);
        result.rawTransaction = rawTx;
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
    return await this.client.request('generateBridgeOutNervosTransaction', payload);
  }
  async sendSignedTransaction<T extends NetworkBase>(
    payload: API.SignedTransactionPayload<T>,
  ): Promise<API.TransactionIdent> {
    return await this.client.request('sendSignedTransaction', payload);
  }
  async getBridgeTransactionStatus(
    payload: API.GetBridgeTransactionStatusPayload,
  ): Promise<API.GetBridgeTransactionStatusResponse> {
    return await this.client.request('getBridgeTransactionStatus', payload);
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
    return await this.client.request('getAssetList', param);
  }
  async getBalance(payload: API.GetBalancePayload): Promise<API.GetBalanceResponse> {
    return await this.client.request('getBalance', payload);
  }
}
