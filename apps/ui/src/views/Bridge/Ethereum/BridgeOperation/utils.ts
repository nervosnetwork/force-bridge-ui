import bech32 from 'bech32';

export function toGodwokenAddress(ethAddress: string): string {
  if (!process.env.REACT_APP_GODWOKEN_ETH_LOCKHASH) throw new Error('env REACT_APP_GODWOKEN_ETH_LOCKHASH not set');
  if (!process.env.REACT_APP_GODWOKEN_ROLLUP_TYPEHASH)
    throw new Error('env REACT_APP_GODWOKEN_ROLLUP_TYPEHASH not set');

  const script = {
    code_hash: process.env.REACT_APP_GODWOKEN_ETH_LOCKHASH,
    hash_type: 'type',
    args: process.env.REACT_APP_GODWOKEN_ROLLUP_TYPEHASH + ethAddress.slice(2),
  };
  const addressPrefix = process.env.REACT_APP_CKB_CHAIN_ID === '0' ? 'ckb' : 'ckt';

  const data = [];
  data.push(script.hash_type === 'type' ? 4 : 2);
  data.push(...hexToByteArray(script.code_hash));
  data.push(...hexToByteArray(script.args));
  const words = bech32.toWords(data);
  const BECH32_LIMIT = 1023;
  return bech32.encode(addressPrefix, words, BECH32_LIMIT);
}

function hexToByteArray(h: string): number[] {
  if (!/^(0x)?([0-9a-fA-F][0-9a-fA-F])*$/.test(h)) {
    throw new Error('Invalid hex string!');
  }
  if (h.startsWith('0x')) {
    h = h.slice(2);
  }
  const array = [];
  while (h.length >= 2) {
    array.push(parseInt(h.slice(0, 2), 16));
    h = h.slice(2);
  }
  return array;
}
