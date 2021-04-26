import { EthereumNetwork } from '@force-bridge/commons';
import { Address, AddressType, ChainID, default as PWCore, PwCollector, Web3ModalProvider } from '@lay2/pw-core';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/inpage-provider';
import warning from 'tiny-warning';
import { default as Web3 } from 'web3';
import { AbstractWalletConnector, ConnectStatus } from 'interfaces/WalletConnector';
import { unimplemented } from 'interfaces/errors';
import { EthWalletSigner } from 'xchain/eth/EthWalletSigner';

export interface ConnectorConfig {
  ckbChainID?:
    | 0 // mainnet
    | 1 // testnet
    | 2; // devnet
}

export class EthereumWalletConnector extends AbstractWalletConnector<EthereumNetwork> {
  private provider: MetaMaskInpageProvider | undefined;
  private config: ConnectorConfig;

  constructor(config?: ConnectorConfig) {
    super();
    this.config = Object.assign({}, config || {}, { ckbChainId: ChainID.ckb_testnet });
    this.init();
  }

  async init(): Promise<void> {
    if (!window.ethereum) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await new PWCore('').init(new Web3ModalProvider(new Web3(window.ethereum)), new PwCollector(''), 1);
    const provider = (await detectEthereumProvider()) as MetaMaskInpageProvider;
    if (!provider) throw new Error('Metamask is required');

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

  private onSignerChanged(accounts: unknown): void {
    warning(typeof accounts === 'string' || Array.isArray(accounts), `unknown account type: ${accounts}`);

    if (!accounts) return super.changeSigner(undefined);

    const address = Array.isArray(accounts) ? accounts[0] : accounts;
    if (typeof address !== 'string') return super.changeSigner(undefined);

    const signer = new EthWalletSigner(new Address(address, AddressType.eth).toCKBAddress(), address, '', '');
    super.changeSigner(signer);
  }
}
