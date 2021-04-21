import { boom } from '../errors';
import { AssetLike } from '../types/module';

// typescript helper function
export function createAssetPredicate<T>(pred: (x: AssetLike) => boolean): <X>(asset: X) => asset is T & X {
  if (typeof pred !== 'function') boom('param of `createAssetPredicate` must be a function');
  return pred as <X>(asset: X) => asset is T & X;
}
