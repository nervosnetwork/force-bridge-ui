/* eslint-disable no-console */
import CKB from '@nervosnetwork/ckb-sdk-core/';
import { ethers } from 'ethers';
import { ForceBridgeAPIV1Handler } from './client';

const FORCE_BRIDGE_URL = 'http://localhost:8080/force-bridge/api/v1';
const client = new ForceBridgeAPIV1Handler(FORCE_BRIDGE_URL);

const ETH_NODE_URL = 'http://127.0.0.1:8545';
const ETH_WALLET_PRIV = '0xc4ad657963930fbff2e9de3404b30a4e21432c89952ed430b56bf802945ed37a';

const CKB_NODE_URL = 'http://127.0.0.1:8114';
const CKB_PRI_KEY = '0xa800c82df5461756ae99b5c6677d019c98cc98c7786b80d7b2e77256e46ea1fe';

async function mint() {
  const mintPayload = {
    sender: '0x0',
    recipient: 'ckt1qyqyph8v9mclls35p6snlaxajeca97tc062sa5gahk',
    asset: {
      network: 'Ethereum',
      ident: '0x0000000000000000000000000000000000000000',
      amount: '1',
    },
  };
  const mintTx = await client.generateBridgeInNervosTransaction(mintPayload);

  // metamask will provide nonce, gasLimit and gasPrice.
  const provider = new ethers.providers.JsonRpcProvider(ETH_NODE_URL);
  const wallet = new ethers.Wallet(ETH_WALLET_PRIV, provider);

  const unsignedTx = <ethers.PopulatedTransaction>mintTx.rawTransaction;
  unsignedTx.nonce = await wallet.getTransactionCount();
  unsignedTx.gasLimit = ethers.BigNumber.from(1000000);
  unsignedTx.gasPrice = ethers.BigNumber.from(0);

  // use metamask to sign and send tx.
  const signedTx = await wallet.signTransaction(unsignedTx);
  const mintTxHash = (await provider.sendTransaction(signedTx)).hash;
  console.log('mint tx hash', mintTxHash);
  return mintTxHash;
}

async function burn() {
  const burnPayload = {
    network: 'Ethereum',
    sender: 'ckt1qyqyph8v9mclls35p6snlaxajeca97tc062sa5gahk',
    recipient: '0x1000000000000000000000000000000000000001',
    asset: '0x0000000000000000000000000000000000000000',
    amount: '1',
  };

  const burnTx = await client.generateBridgeOutNervosTransaction(burnPayload);

  const ckb = new CKB(CKB_NODE_URL);
  const signedTx = ckb.signTransaction(CKB_PRI_KEY)(<CKBComponents.RawTransactionToSign>burnTx.rawTransaction);
  const burnTxHash = await ckb.rpc.sendTransaction(signedTx);
  console.log('burn tx hash', burnTxHash);
  return burnTxHash;
}

async function getTransaction() {
  const getTxPayload = {
    network: 'Ethereum',
    xchainAssetIdent: '0x0000000000000000000000000000000000000000',
    user: {
      network: 'Nervos',
      ident: 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdx87332akjsjjw4j5ez3rsh0gt6gp2skq86ga0nqt',
    },
  };

  const txs = await client.getBridgeTransactionSummaries(getTxPayload);
  console.log('txs', JSON.stringify(txs));
  return txs;
}

async function checkTransaction(txId: string) {
  let find = false;
  for (let i = 0; i < 100; i++) {
    await asyncSleep(3000);
    const txs = await getTransaction();
    for (const tx of txs) {
      if (tx.status == 'Successful' && tx.txSummary.fromTransaction.txId == txId) {
        console.log(tx);
        find = true;
        break;
      }
    }
    if (find) {
      break;
    }
  }
  if (!find) {
    throw new Error(`rpc test failed, can not find record ${txId}`);
  }
}

function asyncSleep(ms = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const mintTxId = await mint();
  await checkTransaction(mintTxId);

  const burnTxId = await burn();
  await checkTransaction(burnTxId);
}

main();
