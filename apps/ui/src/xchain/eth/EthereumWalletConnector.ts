import { EthereumNetwork } from '@force-bridge/commons';
import PWCore, { Address, AddressType, CHAIN_SPECS, ChainID, Config } from '@lay2/pw-core';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/inpage-provider';
import warning from 'tiny-warning';
import { EthWalletSigner } from './EthWalletSigner';
import { AbstractWalletConnector, ConnectStatus } from 'interfaces/WalletConnector';
import { unimplemented } from 'interfaces/errors';

export interface ConnectorConfig {
  ckbChainID:
    | 0 // mainnet
    | 1 // testnet
    | 2; // devnet
}

export class EthereumWalletConnector extends AbstractWalletConnector<EthereumNetwork> {
  private provider: MetaMaskInpageProvider | undefined;
  private readonly config: ConnectorConfig;

  constructor(config?: Partial<ConnectorConfig>) {
    super();
    this.config = Object.assign({}, { ckbChainID: ChainID.ckb_testnet }, config || {}) as ConnectorConfig;
    this.init();
  }

  async init(): Promise<void> {
    const provider = (await detectEthereumProvider()) as MetaMaskInpageProvider;
    if (!provider) throw new Error('Metamask is required');
    PWCore.config = this.getPWConfig();

    provider.on('accountsChanged', (accounts) => this.onSignerChanged(accounts));
    this.provider = provider;
    if (provider.selectedAddress) {
      super.changeStatus(ConnectStatus.Connected);
      this.onSignerChanged(provider.selectedAddress);
    }
  }

  protected async _connect(): Promise<void> {
    if (!this.provider) return Promise.reject('Provider is not loaded, maybe Metamask is not installed');
    return this.provider
      .request?.({ method: 'eth_requestAccounts' })
      .then((accounts) => this.onSignerChanged(accounts));
  }

  protected async _disconnect(): Promise<void> {
    unimplemented();
  }

  private getPWConfig(): Config {
    return [CHAIN_SPECS.Lina, CHAIN_SPECS.Aggron, CHAIN_SPECS.Lay2][this.config.ckbChainID];
  }

  private onSignerChanged(accounts: unknown): void {
    warning(typeof accounts === 'string' || Array.isArray(accounts), `unknown account type: ${accounts}`);
    if (!accounts) return super.changeSigner(undefined);

    const address = Array.isArray(accounts) ? accounts[0] : accounts;
    if (typeof address !== 'string') return super.changeSigner(undefined);

    const signer = new EthWalletSigner(new Address(address, AddressType.eth).toCKBAddress(), address, this.config);
    super.changeSigner(signer);
  }
}
