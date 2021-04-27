import { ForceBridgeAPIV1Handler } from './client';

const client = new ForceBridgeAPIV1Handler();

const mintPayload = {
  sender: '0x0',
  recipient: 'ckt1qyqyph8v9mclls35p6snlaxajeca97tc062sa5gahk',
  asset: {
    network: 'Ethereum',
    ident: '0x0000000000000000000000000000000000000000',
    amount: '1',
  },
};

async function main() {
  const mintTx = await client.generateBridgeInNervosTransaction(mintPayload);
  console.log('mint tx', mintTx);
}

main();
