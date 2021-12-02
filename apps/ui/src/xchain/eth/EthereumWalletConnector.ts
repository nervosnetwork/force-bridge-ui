import { EthereumNetwork } from '@force-bridge/commons';
import { Address, AddressType } from '@lay2/pw-core';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/inpage-provider';
import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils';
import warning from 'tiny-warning';
import { EthWalletSigner } from './EthWalletSigner';
import { unimplemented } from 'errors';
import { AbstractWalletConnector, ConnectStatus } from 'interfaces/WalletConnector';

export interface ConnectorConfig {
  ckbChainID:
    | 0 // mainnet
    | 1 // testnet
    | 2; // devnet
  ckbRpcUrl: string;
  contractAddress: string;
}

function retrySync(retry: () => boolean, options: { times: number; interval: number }): void {
  if (!options.times || retry()) return;
  setTimeout(() => {
    retrySync(retry, { times: options.times - 1, interval: options.interval });
  }, options.interval);
}

export class EthereumWalletConnector extends AbstractWalletConnector<EthereumNetwork> {
  private provider: MetaMaskInpageProvider | undefined;
  private readonly config: ConnectorConfig;

  constructor(config: ConnectorConfig) {
    super();
    this.config = config;
  }

  async init(): Promise<void> {
    const provider = (await detectEthereumProvider()) as MetaMaskInpageProvider;
    if (!provider) throw new Error('Metamask is required');

    provider.on('accountsChanged', (accounts) => this.onSignerChanged(accounts));
    this.provider = provider;
    retrySync(
      () => {
        const selectedAddress = provider.selectedAddress;
        if (!selectedAddress) return false;

        super.changeStatus(ConnectStatus.Connected);
        this.onSignerChanged(selectedAddress);
        return true;
      },
      { times: 5, interval: 100 },
    );
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
    const pwLockscript = new Address(address, AddressType.eth).toLockScript();
    const pwCKBAddress = scriptToAddress(
      {
        args: pwLockscript.args,
        codeHash: pwLockscript.codeHash,
        hashType: pwLockscript.hashType,
      },
      this.config.ckbChainID === 0,
    );
    const signer = new EthWalletSigner(pwCKBAddress, address, this.config);
    super.changeSigner(signer);
  }
}
