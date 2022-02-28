import { helpers, toolkit, core, RPC } from '@ckb-lumos/lumos';
import { SerializeRcLockWitnessLock } from '@ckitjs/rc-lock';
import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';
import { EthereumNetwork, NervosNetwork, utils } from '@force-bridge/commons';
import { BigNumber, ethers } from 'ethers';
import { ConnectorConfig } from './EthereumWalletConnector';
import { boom, unimplemented } from 'errors';
import { AbstractWalletSigner } from 'interfaces/WalletConnector/AbstractWalletSigner';

const Erc20ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 value) returns (boolean)',
];

export class EthWalletSigner extends AbstractWalletSigner<EthereumNetwork> {
  signer: JsonRpcSigner;
  provider: Web3Provider;

  constructor(nervosIdent: string, xchainIdent: string, private _config: ConnectorConfig) {
    super(nervosIdent, xchainIdent);
    if (utils.hasProp(window, 'ethereum')) {
      const ethereum = window.ethereum as ExternalProvider;
      const provider = new ethers.providers.Web3Provider(ethereum);
      this.provider = provider;
      this.signer = provider.getSigner();
    } else {
      boom(unimplemented);
    }
  }

  _isNervosTransaction(
    raw: EthereumNetwork['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): raw is NervosNetwork['RawTransaction'] {
    return !!(
      utils.hasProp(raw, 'cellDeps') &&
      utils.hasProp(raw, 'headerDeps') &&
      utils.hasProp(raw, 'inputs') &&
      utils.hasProp(raw, 'outputs') &&
      utils.hasProp(raw, 'witnesses')
    );
  }

  _isXChainTransaction(
    raw: EthereumNetwork['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): raw is EthereumNetwork['RawTransaction'] {
    return !this._isNervosTransaction(raw);
  }

  async _sendToNervos(raw: NervosNetwork['RawTransaction']): Promise<{ txId: string }> {
    let skeleton = helpers.objectToTransactionSkeleton(raw);
    const messageToSign = skeleton.signingEntries.get(0)?.message;
    if (!messageToSign) throw new Error('Invalid burn tx: no signingEntries');
    if (!window.ethereum) throw new Error('Could not find ethereum wallet');
    const paramsToSign = window.ethereum.isSafePal ? [messageToSign] : [this.identityXChain(), messageToSign];
    let sigs = await this.provider.send('personal_sign', paramsToSign);

    let v = Number.parseInt(sigs.slice(-2), 16);
    if (v >= 27) v -= 27;
    sigs = '0x' + sigs.slice(2, -2) + v.toString(16).padStart(2, '0');

    const signedWitness = new toolkit.Reader(
      core.SerializeWitnessArgs({
        lock: SerializeRcLockWitnessLock({
          signature: new toolkit.Reader(sigs),
        }),
      }),
    ).serializeJson();

    skeleton = skeleton.update('witnesses', (witnesses) => witnesses.push(signedWitness));

    const signedTx = helpers.createTransactionFromSkeleton(skeleton);
    const txHash = await new RPC(process.env.REACT_APP_CKB_RPC_URL).send_transaction(signedTx, 'passthrough');
    return { txId: txHash };
  }

  async _sendToXChain(raw: EthereumNetwork['RawTransaction']): Promise<{ txId: string }> {
    const transactionResponse = await this.signer.sendTransaction(raw);
    return { txId: transactionResponse.hash };
  }

  async approve(asset: EthereumNetwork['DerivedAssetIdent']): Promise<{ txId: string }> {
    const erc20 = new ethers.Contract(asset, Erc20ABI, this.signer);
    const transactionResponse = await erc20.approve(this._config.contractAddress, ethers.constants.MaxUint256);
    return { txId: transactionResponse.hash };
  }

  async getAllowance(asset: EthereumNetwork['DerivedAssetIdent']): Promise<BigNumber> {
    const erc20 = new ethers.Contract(asset, Erc20ABI, this.signer);
    return erc20.allowance(await this.signer.getAddress(), this._config.contractAddress);
  }
}
