import { NervosNetwork, EthereumNetwork, NetworkBase } from '@force-bridge/commons';
import { Keccak256Hasher, Blake2bHasher, Builder } from '@lay2/pw-core';
import { normalizers, Reader, transformers } from 'ckb-js-toolkit';
import { ethers } from 'ethers';
import { SerializeWitnessArgs, SerializeRawTransaction } from '@ckb-lumos/types/lib/core';
import { AbstractWalletSigner } from 'interfaces/WalletConnector/AbstractWalletSigner';
import { hasProp } from '@force-bridge/commons/lib/utils';
import { ExternalProvider } from '@ethersproject/providers/src.ts/web3-provider';
import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider';
import { boom, unimplemented } from 'interfaces/errors';

export class MetaMaskSigner extends AbstractWalletSigner<EthereumNetwork> {
  signer: JsonRpcSigner;

  constructor(private _identNervos: NervosNetwork['UserIdent'], private _identOrigin: EthereumNetwork['UserIdent']) {
    super(_identNervos, _identOrigin);
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

  _isOriginTransaction(
    raw: EthereumNetwork['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): raw is EthereumNetwork['RawTransaction'] {
    return !this._isNervosTransaction(raw);
  }

  async _signNervos(raw: NervosNetwork['RawTransaction']): Promise<NervosNetwork['SignedTransaction']> {
    const witnesses = raw.inputs.map((_) => '0x');
    witnesses[0] = new Reader(
      SerializeWitnessArgs(normalizers.NormalizeWitnessArgs(Builder.WITNESS_ARGS.Secp256k1)),
    ).serializeJson();
    const message = toNervosMessage(raw, witnesses);
    const signature = await this.signNervos(message);
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

  async _signOrigin(raw: EthereumNetwork['RawTransaction']): Promise<EthereumNetwork['SignedTransaction']> {
    // let signed = await this.signer.signTransaction(raw);
    unimplemented();
  }

  identityNervos(): string {
    return this.identityNervos() as string;
  }

  identityOrigin(): string {
    return (this.identityOrigin() as string).toLowerCase();
  }

  private async signNervos(message: string): Promise<string> {
    // return new Promise((resolve, reject) => {
    //   const from = this.identityOrigin();
    //   const params = [message, from];
    //   const method = 'personal_sign';
    //
    //   if (utils.hasProp(window, 'web')) {
    //     // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     // const web3: any = window.web3;
    //
    //     window.web3.currentProvider.sendAsync({ method, params, from }, (err, result) => {
    //       if (err) {
    //         reject(err);
    //       }
    //       if (result.error) {
    //         reject(result.error);
    //       }
    //       result = result.result;
    //       let v = Number.parseInt(result.slice(-2), 16);
    //       if (v >= 27) v -= 27;
    //       result = result.slice(0, -2) + v.toString(16).padStart(2, '0');
    //       resolve(result);
    //     });
    //   }
    // });

    let result = await this.signer.signMessage(ethers.utils.arrayify(message));
    let v = Number.parseInt(result.slice(-2), 16);
    if (v >= 27) v -= 27;
    result = result.slice(0, -2) + v.toString(16).padStart(2, '0');
    return result;
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
