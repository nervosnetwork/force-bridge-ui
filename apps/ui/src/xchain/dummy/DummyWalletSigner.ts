import { AbstractWalletSigner } from 'interfaces/WalletConnector/AbstractWalletSigner';

export class DummyWalletSigner extends AbstractWalletSigner {
  private address: string;

  constructor(address: string) {
    super();
    this.address = address;
  }

  _isNervosTransaction(_raw: unknown): boolean {
    return false;
  }

  _isOriginTransaction(_raw: unknown): boolean {
    return false;
  }

  _signNervos(_raw: unknown): unknown {
    return undefined;
  }

  _signOrigin(_raw: unknown): unknown {
    return undefined;
  }

  identityNervos(): string {
    return 'ckb1address' + Math.random();
  }

  identityOrigin(): string {
    return '0x0000000000000000000000000000000000000000';
  }
}
