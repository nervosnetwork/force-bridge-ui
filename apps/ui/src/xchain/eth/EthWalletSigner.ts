import { ExternalProvider } from '@ethersproject/providers/src.ts/web3-provider';
import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider';
import { SerializeWitnessArgs, SerializeRawTransaction } from '@ckb-lumos/types/lib/core';
import { Keccak256Hasher, Blake2bHasher, Builder } from '@lay2/pw-core';
import { normalizers, Reader, transformers } from 'ckb-js-toolkit';
import { hasProp } from '@force-bridge/commons/lib/utils';
import { ethers } from 'ethers';
import { EthereumNetwork, NervosNetwork } from '@force-bridge/commons';
import { AbstractWalletSigner } from 'interfaces/WalletConnector/AbstractWalletSigner';
import { boom, unimplemented } from 'interfaces/errors';

export class EthWalletSigner extends AbstractWalletSigner<EthereumNetwork> {
  signer: JsonRpcSigner;

  constructor(nervosIdent: string, xchainIdent: string, private _nervosRPCURL: string, private _xchainRPCURL: string) {
    super(nervosIdent, xchainIdent);
    if (hasProp(window, 'ethereum')) {
      const ethereum = window.ethereum as ExternalProvider;
      const provider = new ethers.providers.Web3Provider(ethereum);
      this.signer = provider.getSigner();
    } else {
      boom(unimplemented);
    }
  }

  _isNervosTransaction(
    raw: EthereumNetwork['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): raw is NervosNetwork['RawTransaction'] {
    return !!(
      hasProp(raw, 'version') &&
      hasProp(raw, 'cellDeps') &&
      hasProp(raw, 'headerDeps') &&
      hasProp(raw, 'inputs') &&
      hasProp(raw, 'outputs') &&
      hasProp(raw, 'outputsData') &&
      hasProp(raw, 'witnesses')
    );
  }

  _isXChainTransaction(
    raw: EthereumNetwork['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): raw is EthereumNetwork['RawTransaction'] {
    return !this._isNervosTransaction(raw);
  }

  async _sendToNervos(raw: NervosNetwork['RawTransaction']): Promise<{ txId: string }> {
    console.log('send transaction to Nervos: ' + this._nervosRPCURL);
    const signedTransaction = await this.signNervos(raw);
    // TODO send signedTransaction through RPC
    unimplemented();
  }

  async _sendToXChain(raw: EthereumNetwork['RawTransaction']): Promise<{ txId: string }> {
    console.log('send transaction to XChain: ' + this._xchainRPCURL);
    const transactionResponse = await this.signer.sendTransaction(raw);
    return { txId: transactionResponse.hash };
  }

  async signNervos(raw: NervosNetwork['RawTransaction']): Promise<NervosNetwork['SignedTransaction']> {
    const witnesses = raw.inputs.map((_) => '0x');
    witnesses[0] = new Reader(
      SerializeWitnessArgs(normalizers.NormalizeWitnessArgs(Builder.WITNESS_ARGS.Secp256k1)),
    ).serializeJson();
    const message = toNervosMessage(raw, witnesses);
    const result = await this.signer.signMessage(ethers.utils.arrayify(message));
    let v = Number.parseInt(result.slice(-2), 16);
    if (v >= 27) v -= 27;
    const signature = result.slice(0, -2) + v.toString(16).padStart(2, '0');
    witnesses[0] = new Reader(
      SerializeWitnessArgs(
        normalizers.NormalizeWitnessArgs({
          ...Builder.WITNESS_ARGS.Secp256k1,
          lock: signature,
        }),
      ),
    ).serializeJson();
    raw.witnesses = witnesses;
    return raw as NervosNetwork['SignedTransaction'];
  }
}

function toNervosMessage(raw: NervosNetwork['RawTransaction'], witnesses: string[]): string {
  const hasher = new Keccak256Hasher();
  const txHash = new Blake2bHasher().hash(
    new Reader(SerializeRawTransaction(normalizers.NormalizeRawTransaction(transformers.TransformRawTransaction(raw)))),
  );
  hasher.update(txHash);
  const firstWitness = new Reader(witnesses[0]);
  hasher.update(serializeBigInt(firstWitness.length()));
  hasher.update(firstWitness);
  for (let i = 1; i < witnesses.length; i++) {
    const currentWitness = new Reader(witnesses[i]);
    hasher.update(serializeBigInt(currentWitness.length()));
    hasher.update(currentWitness);
  }
  return hasher.digest().serializeJson();
}

function serializeBigInt(i: number) {
  const view = new DataView(new ArrayBuffer(8));
  view.setUint32(0, i, true);
  return view.buffer;
}
