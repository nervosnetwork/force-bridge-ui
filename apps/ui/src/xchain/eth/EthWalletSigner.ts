import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider';
import { ExternalProvider } from '@ethersproject/providers/src.ts/web3-provider';
import { EthereumNetwork, NervosNetwork } from '@force-bridge/commons';
import { hasProp } from '@force-bridge/commons/lib/utils';
import PWCore, {
  Amount,
  AmountUnit,
  Builder,
  Cell,
  CellDep,
  DepType,
  HashType,
  OutPoint,
  RawTransaction,
  Script,
  Transaction,
  EthProvider,
  PwCollector,
} from '@lay2/pw-core';
import { RPC } from 'ckb-js-toolkit';
import { BigNumber, ethers } from 'ethers';
import { AbstractWalletSigner } from 'interfaces/WalletConnector/AbstractWalletSigner';
import { boom, unimplemented } from 'interfaces/errors';

const Erc20ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 value) returns (boolean)',
];
const LockerContractAddress = '0xcd5a0974eb6ea507eebd627646f216a98d7cb879';

export class EthWalletSigner extends AbstractWalletSigner<EthereumNetwork> {
  signer: JsonRpcSigner;
  pwCore: PWCore;

  constructor(nervosIdent: string, xchainIdent: string, private _nervosRPCURL: string, private _xchainRPCURL: string) {
    super(nervosIdent, xchainIdent);
    if (hasProp(window, 'ethereum')) {
      const ethereum = window.ethereum as ExternalProvider;
      const provider = new ethers.providers.Web3Provider(ethereum);
      this.signer = provider.getSigner();
      this._nervosRPCURL = 'http://121.196.29.165:8114/rpc';
      this.pwCore = new PWCore(this._nervosRPCURL);
      this.init();
    } else {
      boom(unimplemented);
    }
  }

  async init() {
    this.pwCore = await this.pwCore.init(
      new EthProvider(), // a built-in Provider for Ethereum env.
      new PwCollector(this._nervosRPCURL), // a custom Collector to retrive cells from cache server.
    );
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
    const pwTransaction = await this.toPWTransaction(raw);
    pwTransaction.validate();
    const txHash = await this.pwCore.sendTransaction(pwTransaction);
    return { txId: txHash };
  }

  async _sendToXChain(raw: EthereumNetwork['RawTransaction']): Promise<{ txId: string }> {
    const transactionResponse = await this.signer.sendTransaction(raw);
    return { txId: transactionResponse.hash };
  }

  async approve(asset: EthereumNetwork['DerivedAssetIdent']): Promise<{ txId: string }> {
    const erc20 = new ethers.Contract(asset, Erc20ABI, this.signer);
    const transactionResponse = await erc20.approve(LockerContractAddress, ethers.constants.MaxUint256);
    return { txId: transactionResponse.hash };
  }

  async getAllowance(asset: EthereumNetwork['DerivedAssetIdent']): Promise<BigNumber> {
    const erc20 = new ethers.Contract(asset, Erc20ABI, this.signer);
    return erc20.allowance(await this.signer.getAddress(), LockerContractAddress);
  }

  async toPWTransaction(rawTx: NervosNetwork['RawTransaction']): Promise<Transaction> {
    function toPWHashType(hashType: CKBComponents.ScriptHashType): HashType {
      if (hashType === 'data') {
        return HashType.data;
      }
      return HashType.type;
    }

    function toPWDepType(depType: CKBComponents.DepType): DepType {
      if (depType === 'code') {
        return DepType.code;
      }
      return DepType.depGroup;
    }

    const ckbRPC = new RPC(this._nervosRPCURL);
    const inputs = await Promise.all(
      rawTx.inputs.map((i: CKBComponents.CellInput) =>
        Cell.loadFromBlockchain(ckbRPC, new OutPoint(i.previousOutput!.txHash, i.previousOutput!.index)),
      ),
    );
    const outputs = rawTx.outputs.map(
      (o, index) =>
        new Cell(
          new Amount(o.capacity, AmountUnit.shannon),
          new Script(o.lock.codeHash, o.lock.args, toPWHashType(o.lock.hashType)),
          o.type ? new Script(o.type.codeHash, o.type.args, toPWHashType(o.type.hashType)) : undefined,
          undefined,
          rawTx.outputsData[index],
        ),
    );
    const cellDeps = rawTx.cellDeps.map(
      (c) => new CellDep(toPWDepType(c.depType), new OutPoint(c.outPoint!.txHash, c.outPoint!.index)),
    );
    const pwLockCellDeps = [
      new CellDep(
        DepType.code,
        new OutPoint('0x57a62003daeab9d54aa29b944fc3b451213a5ebdf2e232216a3cfed0dde61b38', '0x0'),
      ),
    ];
    cellDeps.push(...pwLockCellDeps);
    return new Transaction(new RawTransaction(inputs, outputs, cellDeps, rawTx.headerDeps, rawTx.version), [
      Builder.WITNESS_ARGS.Secp256k1,
    ]);
  }
}
