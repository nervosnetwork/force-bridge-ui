import { boom } from '../errors';
import { AssetLike } from '../types/module';
import { NetworkTypes } from '../types/network';

// typescript helper function
export function createAssetPredicate<T extends NetworkTypes>(
  pred: (x: AssetLike) => boolean,
): <X>(asset: X) => asset is AssetLike<T> & X {
  if (typeof pred !== 'function') boom('param of `createAssetPredicate` must be a function');
  return pred as <X>(asset: X) => asset is AssetLike<T> & X;
}
