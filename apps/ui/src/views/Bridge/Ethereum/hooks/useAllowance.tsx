import { Asset, eth } from '@force-bridge/commons';
import { useLocalStorage } from '@rehooks/local-storage';
import { useQuery } from 'react-query';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { EthWalletSigner } from 'xchain';

export interface AllowanceState {
  status: 'Querying' | 'NeedApprove' | 'Approving' | 'Approved';
  addApprove: (approve: ApproveInfo) => void;
}

export interface ApproveInfo {
  network: string;
  user: string;
  assetIdent: string;
  txId: string;
}

export function useAllowance(asset: Asset | undefined): AllowanceState | undefined {
  const { signer, network, direction } = ForceBridgeContainer.useContainer();
  // if (!signer) boom('signer is not load');
  const [approveList, setApproveList] = useLocalStorage<ApproveInfo[]>('approveList');
  const addApprove = (approve: ApproveInfo) => {
    if (!approveList) return setApproveList([approve]);
    setApproveList(approveList.concat(approve));
  };
  const disableApprove =
    !signer ||
    !asset ||
    (network !== 'Ethereum' && network !== 'Bsc') ||
    direction === BridgeDirection.Out ||
    !eth.module.assetModel.isDerivedAsset(asset);

  const query = useQuery(
    [signer?.identityXChain(), asset?.ident, network],
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
    approveList.find(
      (item) => item.user === signer.identityXChain() && item.network === network && item.assetIdent === asset.ident,
    )
  )
    return { status: 'Approving', addApprove };
  return { status: 'NeedApprove', addApprove };
}
