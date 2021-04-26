import { NetworkBase } from '@force-bridge/commons';
import { EventEmitter } from 'eventemitter3';
import { ConnectStatus, TwoWaySigner, Wallet } from './types';

/**
 * @example
 * ```ts
 *  class FakeEthereumNetworkWallet {
 *    constructor() {
 *      web3.account.on('changed', (accounts) => {
 *        if (accounts.length === 0) {
 *          super.changeSigner(undefined);
 *          super.changeConnectStatus(Disconnected);
 *        } else {
 *          super.changeSigner(accounts[0]);
 *          super.changeConnectStatus(Connected);
 *        }
 *    });
 * }
 * ```
 */
export abstract class AbstractWalletConnector<T extends NetworkBase> extends EventEmitter implements Wallet<T> {
  status: ConnectStatus = ConnectStatus.Disconnected;

  connect(): void {
    if (this.status !== ConnectStatus.Disconnected) return;

    this.changeStatus(ConnectStatus.Connecting);
    this._connect().then(
      () => this.changeStatus(ConnectStatus.Connected),
      (e) => {
        this.changeStatus(ConnectStatus.Disconnected);
        this.onError(e);
      },
    );
  }

  disconnect(): void {
    this._disconnect().then(
      () => this.changeStatus(ConnectStatus.Disconnected),
      (e) => this.onError(e),
    );
  }

  protected changeStatus(connectStatus: ConnectStatus): void {
    this.status = connectStatus;
    this.emit('connectStatusChanged', connectStatus);
  }

  protected changeSigner(signer: TwoWaySigner<T> | undefined): void {
    this.emit('signerChanged', signer);
  }

  private onError(e: Error): void {
    this.emit('error', e);
  }

  /**
   * impl connect method on the extended class
   * @example
   * ```ts
   * _connect(): Promise<void> {
   *  return web3.currentProvider.connect()
   * }
   * ```
   */
  protected abstract _connect(): Promise<void>;

  /**
   * impl disconnect method on the extended class
   * @example
   * ```ts
   * _connect(): Promise<void> {
   *  return web3.currentProvider.disconnect()
   * }
   * ```
   */
  protected abstract _disconnect(): Promise<void>;
}
