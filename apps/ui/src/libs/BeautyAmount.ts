import { AmountWithoutDecimals, Asset } from '@force-bridge/commons';
import { BigNumber } from 'bignumber.js';
import warning from 'tiny-warning';

export type BeautyAmountFromOptions =
  | { decimals?: number; amount?: AmountWithoutDecimals }
  | { info?: { decimals: number }; amount?: AmountWithoutDecimals };

export type HumanizeOptions = { decimalPlaces?: number; separator?: boolean };

export class BeautyAmount {
  val: BigNumber;

  // decimals of an asset
  decimals: number;

  constructor(amount: AmountWithoutDecimals | BigNumber, decimals: number) {
    this.val = new BigNumber(amount);
    this.decimals = decimals;
  }

  static from(options: BeautyAmountFromOptions | string | Asset, decimals = 0): BeautyAmount {
    if (options instanceof Asset) {
      const asset = options;
      warning(asset.info?.decimals != null, 'the decimals info is missing');
      return new BeautyAmount(asset.amount, asset.info?.decimals ?? 0);
    }

    if (typeof options === 'string') {
      warning(decimals != null, 'the decimals info is missing');
      return new BeautyAmount(options, decimals);
    }
    if ('info' in options) {
      warning(options.info?.decimals != null, 'the decimals info is missing');
      return new BeautyAmount(options.amount || '0', options.info?.decimals ?? 0);
    }

    warning('decimals' in options && options.decimals != null, 'the decimals info is missing');
    return new BeautyAmount(options.amount || '0', 'decimals' in options ? options.decimals ?? 0 : 0);
  }

  static fromHumanize(humanizeAmount: string, decimals: number): BeautyAmount {
    return new BeautyAmount(new BigNumber(humanizeAmount).times(new BigNumber(10).pow(decimals)), decimals);
  }

  setVal(value: BigNumber | ((val: BigNumber) => BigNumber) | AmountWithoutDecimals): this {
    if (typeof value === 'function') {
      this.val = value(this.val);
      return this;
    }

    this.val = new BigNumber(value);
    return this;
  }

  humanize(options?: HumanizeOptions): string {
    const { decimalPlaces = Infinity, separator = true } = options ?? {};

    const valWithDecimals = this.val.times(new BigNumber(10).pow(-this.decimals));
    const originDecimalPlaces = valWithDecimals.decimalPlaces();

    const rounded = valWithDecimals.decimalPlaces(Math.min(originDecimalPlaces, decimalPlaces), BigNumber.ROUND_FLOOR);

    if (separator) return rounded.toFormat();
    return rounded.toString();
  }
}
