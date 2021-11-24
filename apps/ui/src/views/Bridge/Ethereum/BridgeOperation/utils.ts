import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils';

export function toGodwokenAddress(ethAddress: string): string {
  if (!process.env.REACT_APP_GODWOKEN_ETH_LOCKHASH) throw new Error('env REACT_APP_GODWOKEN_ETH_LOCKHASH not set');
  if (!process.env.REACT_APP_GODWOKEN_ROLLUP_TYPEHASH)
    throw new Error('env REACT_APP_GODWOKEN_ROLLUP_TYPEHASH not set');

  const script = {
    codeHash: process.env.REACT_APP_GODWOKEN_ETH_LOCKHASH,
    hashType: 'type' as const,
    args: process.env.REACT_APP_GODWOKEN_ROLLUP_TYPEHASH + ethAddress.slice(2),
  };
  const isMainnet = process.env.REACT_APP_CKB_CHAIN_ID === '0';

  return scriptToAddress(script, isMainnet);
}
