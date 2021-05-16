import { Asset, eth } from '@force-bridge/commons';
import { useLocalStorage } from '@rehooks/local-storage';
import { useQuery } from 'react-query';
import { BridgeDirection, useForceBridge } from '../../../state';
import { EthWalletSigner } from '../../index';

export interface AllowanceState {
  status: 'Querying' | 'NeedApprove' | 'Approving' | 'Approved';
  addApprove: (approve: ApproveInfo) => void;
}

export interface ApproveInfo {
  user: string;
  assetIdent: string;
  txId: string;
}

export function useAllowance(asset: Asset | undefined): AllowanceState | undefined {
  const { signer, network, direction } = useForceBridge();
  // if (!signer) boom('signer is not load');
  const [approveList, setApproveList] = useLocalStorage<ApproveInfo[]>('approveList');
  const addApprove = (approve: ApproveInfo) => {
    if (!approveList) return setApproveList([approve]);
    approveList.push(approve);
    setApproveList(approveList);
  };
  const disableApprove =
    !signer ||
    !asset ||
    network !== 'Ethereum' ||
    direction === BridgeDirection.Out ||
    !eth.module.assetModel.isDerivedAsset(asset);

  const query = useQuery(
    [signer?.identityXChain(), asset?.ident],
    async () => {
      if (!asset || !signer) return;
      return await (signer as EthWalletSigner).getAllowance(asset.ident);
    },
    {
      enabled: !disableApprove,
      refetchInterval: 5000,
    },
  );
  if (disableApprove || !signer || !asset) return;
  if (!query.data) return { status: 'Querying', addApprove };
  if (query.data.gte(asset.amount)) return { status: 'Approved', addApprove };
  if (
    approveList &&
    approveList.find((item) => item.user === signer.identityXChain() && item.assetIdent === asset.ident)
  )
    return { status: 'Approving', addApprove };
  return { status: 'NeedApprove', addApprove };
}
