import Icon from '@ant-design/icons';
import { Button, Divider, Row, Spin, Typography } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAllowance } from '../hooks/useAllowance';
import { useApproveTransaction } from '../hooks/useApproveTransaction';
import { useChainId } from '../hooks/useChainId';
import { BridgeReminder } from './BridgeReminder';
import { SubmitButton } from './SubmitButton';
import { SwitchMetaMaskNetworkButton } from './SwitchMetaMaskNetworkButton';
import { ReactComponent as BridgeDirectionIcon } from './resources/icon-bridge-direction.svg';
import { useAutoSetBridgeToAmount } from './useAutoSetBridgeToAmount';
import { HumanizeAmount } from 'components/AssetAmount';
import { AssetSelector } from 'components/AssetSelector';
import { AssetSymbol } from 'components/AssetSymbol';
import { StyledCardWrapper } from 'components/Styled';
import { UserInput } from 'components/UserInput';
import { WalletConnectorButton } from 'components/WalletConnector';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { useBridgeFeeQuery, useValidateBridgeOperationForm, ValidateResult } from 'hooks/bridge-operation';
import { useAssetQuery } from 'hooks/useAssetQuery';
import { useSearchParams } from 'hooks/useSearchParams';
import { BeautyAmount } from 'libs';
import { useSelectBridgeAsset } from 'views/Bridge/hooks/useSelectBridgeAsset';
import { useSendBridgeTransaction } from 'views/Bridge/hooks/useSendBridgeTransaction';

const BridgeViewWrapper = styled(StyledCardWrapper)`
  .label {
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.8);
  }

  .input-wrapper {
    padding: 28px 0;
  }
`;

const HelpWrapper = styled(Typography.Text)`
  padding-left: 8px;
`;

const Help: React.FC<{ validateStatus: 'error' | ''; help?: string }> = ({ validateStatus, help }) => {
  if (validateStatus !== 'error') return null;
  return <HelpWrapper type="danger">{help}</HelpWrapper>;
};

export const BridgeOperationForm: React.FC = () => {
  useAutoSetBridgeToAmount();

  const { signer, direction, switchBridgeDirection, network } = ForceBridgeContainer.useContainer();
  const query = useAssetQuery();
  const history = useHistory();
  const location = useLocation();
  const { selectedAsset, setSelectedAsset } = useSelectBridgeAsset();

  const searchParams = useSearchParams();
  const initRecipient = searchParams.get('recipient');
  const initAmount = searchParams.get('amount');

  const feeQuery = useBridgeFeeQuery();
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
    bridgeToAmount,
    bridgeFromAmount,
    setBridgeFromAmount,
    setRecipient,
    recipient,
  } = BridgeOperationFormContainer.useContainer();

  const allowance = useAllowance(selectedAsset);
  const enableApproveButton = allowance && allowance.status === 'NeedApprove';

  const { mutateAsync: sendBridgeTransaction, isLoading: isBridgeLoading } = useSendBridgeTransaction();
  const { mutateAsync: sendApproveTransaction, isLoading: isApproveLoading } = useApproveTransaction();
  const isLoading = isBridgeLoading || isApproveLoading;

  function resetForm() {
    reset();
    if (!signer) return;
    setRecipient('');
  }

  useEffect(resetForm, [direction, reset, setRecipient, signer]);

  function onSubmit() {
    const needApprove = allowance && allowance.status === 'NeedApprove';
    if (!selectedAsset || (!recipient && !needApprove) || !selectedAsset.shadow) return;

    if (needApprove) {
      sendApproveTransaction({ asset: selectedAsset, addApprove: allowance.addApprove }).then(resetForm);
    } else {
      const asset = direction === BridgeDirection.In ? selectedAsset.copy() : selectedAsset.shadow?.copy();
      if (asset.info?.decimals == null) boom('asset info is not loaded');

      asset.amount = BeautyAmount.fromHumanize(bridgeFromAmount, asset.info.decimals).val.toString();
      sendBridgeTransaction({ asset, recipient }).then(resetForm);
    }
  }

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
        disabled={validateStatus !== 'success' && !enableApproveButton}
        block
        type="primary"
        size="large"
        onClick={formik.submitForm}
        allowanceStatus={allowance}
        isloading={isLoading}
      />
    );

  return (
    <BridgeViewWrapper>
      <WalletConnectorButton block type="primary" />

      <div className="input-wrapper">
        <UserInput
          id="bridgeInInputAmount"
          name="bridgeInInputAmount"
          onBlur={formik.handleBlur}
          value={bridgeFromAmount}
          onChange={(e) => setBridgeFromAmount(e.target.value)}
          label={
            <span>
              <label className="label" style={{ fontSize: '14px' }}>
                {direction === BridgeDirection.In ? `${network}:` : 'Nervos:'}
              </label>
              &nbsp;
              <AssetSelector
                btnProps={{ disabled: query.data == null, loading: query.isLoading }}
                options={assetList}
                rowKey={(asset) => asset.identity()}
                selected={selectedAsset?.identity()}
                onSelect={(_id, asset) => setSelectedAsset(asset)}
              />
            </span>
          }
          extra={
            selectedAsset && (
              <Button
                type="link"
                size="small"
                onClick={() => setBridgeFromAmount(BeautyAmount.from(selectedAsset).humanize({ separator: false }))}
              >
                Max:&nbsp;
                <HumanizeAmount asset={selectedAsset} humanize={{ decimalPlaces: 4 }} />
              </Button>
            )
          }
          placeholder="0.0"
          disabled={selectedAsset == null || signer == null}
        />
        <Help {...statusOf('bridgeInInputAmount')} />
      </div>

      <Row justify="center" align="middle">
        <Icon style={{ fontSize: '24px' }} component={BridgeDirectionIcon} onClick={() => switchBridgeDirection()} />
      </Row>

      <div className="input-wrapper">
        <UserInput
          label={
            <span>
              <label className="label" style={{ fontSize: '14px' }}>
                {direction === BridgeDirection.In ? 'Nervos:' : `${network}:`}
              </label>
              &nbsp;
              {selectedAsset && (
                <Button size="small" disabled={true}>
                  <AssetSymbol info={selectedAsset?.shadow?.info} />
                </Button>
              )}
            </span>
          }
          placeholder="0.0"
          disabled
          value={bridgeToAmount}
          extra={
            <Button type="link" size="small">
              {feeQuery.data && (
                <>
                  Fee:&nbsp;
                  <HumanizeAmount asset={feeQuery.data.fee} />
                </>
              )}
              {feeQuery.isLoading && <Spin />}
            </Button>
          }
        />
      </div>

      <Divider dashed style={{ margin: 0, padding: 0 }} />

      <div className="input-wrapper">
        <UserInput
          id="recipient"
          name="recipient"
          onBlur={formik.handleBlur}
          label={
            <span className="label" style={{ fontSize: '14px' }}>
              Recipient:
            </span>
          }
          tooltip={
            direction === BridgeDirection.In
              ? 'Please make sure the filled address belong to a sUDT-compatible application, otherwise your funds may be locked until the application adds sUDT support.'
              : undefined
          }
          placeholder={
            direction === BridgeDirection.In ? 'input ckb address' : `input ${network.toLowerCase()} address`
          }
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Help {...statusOf('recipient')} />
      </div>

      {actionButton}

      <BridgeReminder />
    </BridgeViewWrapper>
  );
};
