import { Signer } from '@force-bridge/commons';

export enum ConnectStatus {
  Connected = 'Connected',
  Connecting = 'Connecting',
  Disconnected = 'Disconnected',
}

export interface TwoWayIdentity {
  // get the signer identity, maybe an address of Ethereum or an account name of EOS
  identityOrigin(): string;

  // get the signer identity of Nervos, e.g. ckt....
  identityNervos(): string;
}

// Since Nervos supports multiple signatures,
// a TwoWaySigner is able to sign Nervos transactions as well as transactions from the other network
export interface TwoWaySigner<Raw = unknown, Signed = unknown> extends Signer<Raw, Signed>, TwoWayIdentity {}

export interface Wallet<Raw = unknown, Signed = unknown> {
  // connect to the wallet
  connect(): void;

  // disconnect the wallet
  disconnect(): void;

  // an event triggered when signer has changed, cases that include signer unmount
  on(event: 'signerChanged', listener: (signer: TwoWaySigner<Raw, Signed> | undefined) => void): void;

  // an event triggered when connect status was changed
  on(event: 'connectStatusChanged', listener: (status: ConnectStatus) => void): void;

  // an event triggered when an error occurred
  on(event: 'error', listener: <E extends Error>(error: E) => void): void;
}
