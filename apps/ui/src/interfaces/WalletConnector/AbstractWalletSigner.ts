import { TwoWaySigner } from './types';
import { boom, unimplemented } from 'interfaces/errors';

export abstract class AbstractWalletSigner<Raw = unknown, Signed = unknown> implements TwoWaySigner<Raw, Signed> {
  async sign(raw: Raw): Promise<Signed> {
    if (this._isNervosTransaction(raw)) return this._signNervos(raw);
    if (this._isOriginTransaction(raw)) return this._signOrigin(raw);

    boom(unimplemented);
  }

  // sign for origin network
  abstract _signOrigin(raw: Raw): Signed;

  // sign for nervos network
  abstract _signNervos(raw: Raw): Signed;

  // check if this RawTransaction is signed for origin network
  abstract _isOriginTransaction(raw: Raw): boolean;

  // check if this RawTransaction is signed for Nervos
  abstract _isNervosTransaction(raw: Raw): boolean;

  // current signer identity on Nervos
  abstract identityNervos(): string;

  // current signer identity on origin network
  abstract identityOrigin(): string;
}
