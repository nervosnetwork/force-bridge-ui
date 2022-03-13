import { Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAllowance } from '../hooks/useAllowance';
import { useApproveTransaction } from '../hooks/useApproveTransaction';
import { useChainId } from '../hooks/useChainId';
import { BridgeReminder } from './BridgeReminder';
import { SubmitButton } from './SubmitButton';
import { SwitchMetaMaskNetworkButton } from './SwitchMetaMaskNetworkButton';
import { ForceBridgeLogo, Transfer } from './styled';
import { useAutoSetBridgeToAmount } from './useAutoSetBridgeToAmount';
import forcebridge from 'assets/images/forcebridge-white.png';
import { AssetSelector } from 'components/AssetSelector';

import { NetworkDirectionPreview } from 'components/NetworkDirectionPreview';
import { NetworkDirectionSelector } from 'components/NetworkDirectionSelector';
import { TransferAccordion } from 'components/TransferAccordion';
import { TransferModal } from 'components/TransferModal';
import { UserInput } from 'components/UserInput';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { useValidateBridgeOperationForm, ValidateResult } from 'hooks/bridge-operation';
import { useAssetQuery } from 'hooks/useAssetQuery';
import { useSearchParams } from 'hooks/useSearchParams';
import { ConnectStatus } from 'interfaces/WalletConnector';
import { BeautyAmount } from 'libs';
import { useSelectBridgeAsset } from 'views/Bridge/hooks/useSelectBridgeAsset';
import { useSendBridgeTransaction } from 'views/Bridge/hooks/useSendBridgeTransaction';

const Help: React.FC<{ validateStatus: 'error' | ''; help?: string }> = ({ validateStatus, help }) => {
  if (validateStatus !== 'error') return null;
  return (
    <Typography variant="body2" color="info.main" marginTop={1}>
      {help}
    </Typography>
  );
};

export const BridgeOperationForm: React.FC = () => {
  useAutoSetBridgeToAmount();

  const {
    signer,
    network,
    direction,
    switchBridgeDirection,
    switchNetwork,
    supportedNetworks,
    walletConnectStatus,
  } = ForceBridgeContainer.useContainer();
  const query = useAssetQuery();
  const location = useLocation();
  const history = useHistory();
  const { selectedAsset, setSelectedAsset } = useSelectBridgeAsset();

  const searchParams = useSearchParams();
  const initRecipient = searchParams.get('recipient');
  const initAmount = searchParams.get('amount');

  const [toNetworkLabel, setToNetworkLabel] = useState<string>('');
  const { validate, status: validateStatus, reset, result: errors } = useValidateBridgeOperationForm();

  useEffect(() => {
    validate();
  }, [validate]);

  const formik = useFormik<ValidateResult>({
    onSubmit,
    initialValues: {},
    validate,
    initialTouched: { bridgeInInputAmount: !!initAmount, recipient: !!initRecipient },
  });

  const {
    bridgeFromAmount,
    setBridgeFromAmount,
    setRecipient,
    recipient,
  } = BridgeOperationFormContainer.useContainer();

  const isConnected = walletConnectStatus === ConnectStatus.Connected;

  const allowance = useAllowance(selectedAsset);
  const enableApproveButton = allowance && allowance.status === 'NeedApprove';
  const needApprove = allowance && allowance.status === 'NeedApprove';

  const { mutateAsync: sendBridgeTransaction, isLoading: isBridgeLoading } = useSendBridgeTransaction();
  const { mutateAsync: sendApproveTransaction, isLoading: isApproveLoading } = useApproveTransaction();
  const isLoading = isBridgeLoading || isApproveLoading;

  const [loadingDialog, setLoadingDialog] = useState<boolean>(false);

  function resetForm() {
    reset();
    if (!signer) return;
    setRecipient('');
  }

  useEffect(resetForm, [direction, reset, setRecipient, signer]);

  function onSubmit() {
    if (!selectedAsset || (!recipient && !needApprove) || !selectedAsset.shadow) return;
    const asset = direction === BridgeDirection.In ? selectedAsset.copy() : selectedAsset.shadow?.copy();
    if (asset.info?.decimals == null) boom('asset info is not loaded');
    asset.amount = BeautyAmount.fromHumanize(bridgeFromAmount, asset.info.decimals).val.toString();
    sendBridgeTransaction({ asset, recipient }).then(afterSubmit).catch(declineTransaction);
    setLoadingDialog(true);
  }

  const afterSubmit = () => {
    resetForm();
  };

  const declineTransaction = () => {
    setLoadingDialog(false);
    handleCloseModal();
  };

  const assetList = useMemo(() => {
    if (!query.data) return [];
    if (direction === BridgeDirection.In) return query.data.xchain;
    return query.data.nervos;
  }, [direction, query.data]);

  // bind url query with the input
  useEffect(() => {
    if (!initRecipient && !initAmount) return;
    setRecipient(initRecipient ?? '');
    setBridgeFromAmount(initAmount ?? '');
  }, [initAmount, initRecipient, setBridgeFromAmount, setRecipient, signer]);

  // remove recipient and amount from url once signer loaded
  useEffect(() => {
    if (!signer) return;
    if (!initAmount && !initRecipient) return;

    searchParams.delete('recipient');
    searchParams.delete('amount');

    history.replace({ search: searchParams.toString() });
  }, [signer, searchParams, history, location, initAmount, initRecipient]);

  const statusOf = (name: keyof ValidateResult) => {
    const touched = formik.touched[name];
    const message = errors?.[name];

    const status = (touched && message ? 'error' : '') as 'error' | '';
    const help = status === 'error' ? message : '';
    return { help, validateStatus: status };
  };

  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleCloseModal = () => setOpenModal(false);

  const submitForm = () => {
    formik.submitForm();
  };

  const handleSubmitButtonClick = () => {
    if (needApprove && selectedAsset) {
      sendApproveTransaction({ asset: selectedAsset, addApprove: allowance.addApprove })
        .then(afterSubmit)
        .catch(declineTransaction);
    } else {
      setOpenModal(true);
    }
  };

  const metamaskChainId = useChainId();
  const bridgeChainInfo =
    network === 'Ethereum'
      ? {
          chainId: Number(process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_ID),
          chainName: process.env.REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME,
        }
      : {
          chainId: Number(process.env.REACT_APP_BSC_ENABLE_CHAIN_ID),
          chainName: process.env.REACT_APP_BSC_ENABLE_CHAIN_NAME,
        };

  const actionButton =
    metamaskChainId !== null && metamaskChainId !== bridgeChainInfo.chainId ? (
      <SwitchMetaMaskNetworkButton
        chainId={`0x${bridgeChainInfo.chainId.toString(16)}`}
        chainName={bridgeChainInfo.chainName}
      />
    ) : (
      <SubmitButton
        disabled={(validateStatus !== 'success' && !enableApproveButton && isConnected) || isLoading}
        onClick={() => handleSubmitButtonClick()}
        allowanceStatus={allowance}
        isloading={isLoading}
      />
    );

  useEffect(() => {
    let networkLabel;
    if (network === 'Ethereum') {
      networkLabel = direction === BridgeDirection.In ? 'CKB' : 'ETH';
    } else {
      networkLabel = direction === BridgeDirection.In ? 'CKB' : 'Bsc';
    }
    setToNetworkLabel(networkLabel);
  }, [network, direction]);

  return (
    <>
      <ForceBridgeLogo src={forcebridge} />
      <Transfer>
        <NetworkDirectionSelector
          networks={supportedNetworks}
          network={network}
          direction={direction}
          onSelect={({ network, direction }) => {
            switchNetwork(network);
            switchBridgeDirection(direction);
          }}
        />
        <NetworkDirectionPreview
          networks={supportedNetworks}
          network={network}
          direction={direction}
          onSelect={({ network, direction }) => {
            switchNetwork(network);
            switchBridgeDirection(direction);
          }}
        />
        <div className="input-wrapper">
          <AssetSelector
            btnProps={{ disabled: query.data == null, loading: query.isLoading }}
            options={assetList}
            rowKey={(asset) => asset.identity()}
            selected={selectedAsset?.identity()}
            onSelect={(_id, asset) => setSelectedAsset(asset)}
            disabled={!isConnected}
          />
        </div>

        <UserInput
          id="bridgeInInputAmount"
          name="bridgeInInputAmount"
          onBlur={formik.handleBlur}
          value={bridgeFromAmount}
          onChange={(e) => setBridgeFromAmount(e.target.value)}
          label={'Amount'}
          error={statusOf('bridgeInInputAmount').validateStatus === 'error'}
          endAdornment={
            selectedAsset && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setBridgeFromAmount(BeautyAmount.from(selectedAsset).humanize({ separator: false }))}
              >
                Max
              </Button>
            )
          }
          placeholder="0.0"
          disabled={selectedAsset == null || signer == null}
        />
        <Help {...statusOf('bridgeInInputAmount')} />

        <div className="input-wrapper">
          <UserInput
            id="recipient"
            name="recipient"
            onBlur={formik.handleBlur}
            label={`To ${toNetworkLabel} Address`}
            error={statusOf('recipient').validateStatus === 'error'}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={selectedAsset == null || signer == null}
            tooltip={direction === BridgeDirection.In}
          />
          <Help {...statusOf('recipient')} />
        </div>

        {recipient && bridgeFromAmount && selectedAsset && <TransferAccordion selectedAsset={selectedAsset} />}
        <BridgeReminder />

        {actionButton}
      </Transfer>
      {selectedAsset && (
        <TransferModal
          open={openModal}
          onClose={handleCloseModal}
          submitForm={submitForm}
          selectedAsset={selectedAsset}
          recipient={recipient}
          loadingDialog={loadingDialog}
        />
      )}
    </>
  );
};
