export const assetList = [
  {
    network: 'Ethereum',
    ident: '0x0000000000000000000000000000000000000000',
    info: {
      decimals: 18,
      name: 'ETH',
      symbol: 'Eth',
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=002',
      shadow: { network: 'Nervos', ident: 'ckt1qyqyph8v9mclls35p6snlaxajeca97tc062sa5gahk' },
    },
  },
  {
    network: 'Nervos',
    ident: 'ckt1qyqyph8v9mclls35p6snlaxajeca97tc062sa5gahk',
    info: {
      decimals: 18,
      name: 'ETH',
      symbol: 'Eth',
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=002',
      shadow: { network: 'Ethereum', ident: '0x0000000000000000000000000000000000000000' },
    },
  },
];
