import { NervosNetwork, NetworkBase, utils } from '@force-bridge/commons';
import { Keccak256Hasher, Blake2bHasher, Builder, ECDSA_WITNESS_LEN } from '@lay2/pw-core';
import { normalizers, Reader, transformers } from 'ckb-js-toolkit';
import { SerializeWitnessArgs, SerializeRawTransaction } from '@ckb-lumos/types/lib/core';
import { AbstractWalletSigner } from 'interfaces/WalletConnector/AbstractWalletSigner';
import { unimplemented } from 'interfaces/errors';

export class MetaMaskSigner extends AbstractWalletSigner<NetworkBase> {
  _isNervosTransaction(raw: unknown): raw is NervosNetwork['RawTransaction'] {
    return false;
  }

  _isOriginTransaction(raw: unknown): raw is NetworkBase['RawTransaction'] {
    return false;
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
    return raw;
  }

  _signOrigin(raw: NetworkBase['RawTransaction']): NetworkBase['SignedTransaction'] {
    unimplemented();
  }

  identityNervos(): string {
    return 'ckt1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  }

  identityOrigin(): string {
    return (this.identOrigin() as { address: string }).address.toLowerCase();
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

    const from = this.identityOrigin();
    let result = await window.web3.eth.personal.sign(message, from, null);
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
