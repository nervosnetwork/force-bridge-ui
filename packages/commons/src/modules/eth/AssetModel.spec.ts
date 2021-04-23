import { EthereumAssetModel } from './AssetModel';

test('test eth asset model', () => {
  expect(
    EthereumAssetModel.isNativeAsset({
      network: 'hello',
      ident: '',
    }),
  ).toBe(false);
});
