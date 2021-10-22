import { Script } from '@ckb-lumos/base';
import { generateAddress } from '@ckb-lumos/helpers';

export function toGodwokenAddress(ethAddress: string): string {
  if (!process.env.REACT_APP_GODWOKEN_ETH_LOCKHASH) throw new Error('env REACT_APP_GODWOKEN_ETH_LOCKHASH not set');
  if (!process.env.REACT_APP_GODWOKEN_ROLLUP_TYPEHASH)
    throw new Error('env REACT_APP_GODWOKEN_ROLLUP_TYPEHASH not set');
  const script: Script = {
    code_hash: process.env.REACT_APP_GODWOKEN_ETH_LOCKHASH,
    hash_type: 'type',
    args: process.env.REACT_APP_GODWOKEN_ROLLUP_TYPEHASH + ethAddress.slice(2),
  };
  const addressPrefix = process.env.REACT_APP_CKB_CHAIN_ID === '0' ? 'ckb' : 'ckt';
  return generateAddress(script, { config: { PREFIX: addressPrefix, SCRIPTS: {} } });
}
