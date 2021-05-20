import Icon from '@ant-design/icons';
import { Button, Divider, Row, Typography } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAllowance } from '../hooks/useAllowance';
import { useApproveTransaction } from '../hooks/useApproveTransaction';
import { SubmitButton } from './SubmitButton';
import { ReactComponent as BridgeDirectionIcon } from './resources/icon-bridge-direction.svg';
import { HumanizeAmount } from 'components/AssetAmount';
import { AssetSelector } from 'components/AssetSelector';
import { AssetSymbol } from 'components/AssetSymbol';
import { StyledCardWrapper } from 'components/Styled';
import { UserInput } from 'components/UserInput';
import { WalletConnectorButton } from 'components/WalletConnector';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { useAssetQuery } from 'hooks/useAssetQuery';
import { useSearchParams } from 'hooks/useSearchParams';
import { BeautyAmount } from 'libs';
import { useBridgeInput, ValidationResult } from 'views/Bridge/hooks/useBridgeInput';
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
  const { signer, direction, switchBridgeDirection } = ForceBridgeContainer.useContainer();
  const query = useAssetQuery();
  const history = useHistory();
  const location = useLocation();
  const { selectedAsset, setSelectedAsset } = useSelectBridgeAsset();

  const searchParams = useSearchParams();
  const initRecipient = searchParams.get('recipient');
  const initAmount = searchParams.get('amount');

  const formik = useFormik<ValidationResult>({
    onSubmit,
    initialValues: {},
    validate: () => errors,
    initialTouched: { bridgeInInputAmount: !!initAmount, recipient: !!initRecipient },
  });

  const {
    bridgeOutInputAmount,
    bridgeInInputAmount,
    setBridgeInInputAmount,
    setRecipient,
    recipient,
    errors,
    validateStatus,
    reset,
  } = useBridgeInput(selectedAsset);

  const allowance = useAllowance(selectedAsset);
  const enableApproveButton = allowance && allowance.status === 'NeedApprove';

  const { mutateAsync: sendBridgeTransaction, isLoading: isBridgeLoading } = useSendBridgeTransaction();
  const { mutateAsync: sendApproveTransaction, isLoading: isApproveLoading } = useApproveTransaction();
  const isLoading = isBridgeLoading || isApproveLoading;

  function resetForm() {
    reset();
    if (!signer) return;

    if (direction === BridgeDirection.In) setRecipient(signer.identityNervos());
    else setRecipient(signer.identityXChain());
  }

  useEffect(resetForm, [direction, reset, setRecipient, signer]);

  function onSubmit() {
    if (!selectedAsset || !recipient || !selectedAsset.shadow) return;

    if (allowance && allowance.status === 'NeedApprove') {
      sendApproveTransaction({ asset: selectedAsset, addApprove: allowance.addApprove }).then(resetForm);
    } else {
      const asset = direction === BridgeDirection.In ? selectedAsset.copy() : selectedAsset.shadow?.copy();
      if (asset.info?.decimals == null) boom('asset info is not loaded');

      asset.amount = BeautyAmount.fromHumanize(bridgeInInputAmount, asset.info.decimals).val.toString();
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
    setBridgeInInputAmount(initAmount ?? '');
  }, [initAmount, initRecipient, setBridgeInInputAmount, setRecipient, signer]);

  // remove recipient and amount from url once signer loaded
  useEffect(() => {
    if (!signer) return;
    if (!initAmount && !initRecipient) return;

    searchParams.delete('recipient');
    searchParams.delete('amount');

    history.replace({ search: searchParams.toString() });
  }, [signer, searchParams, history, location, initAmount, initRecipient]);

  const statusOf = (name: keyof ValidationResult) => {
    const touched = formik.touched[name];
    const message = errors?.[name];

    const status = (touched && message ? 'error' : '') as 'error' | '';
    const help = status === 'error' ? message : '';
    return { help, validateStatus: status };
  };

  return (
    <BridgeViewWrapper>
      <WalletConnectorButton block type="primary" />

      <div className="input-wrapper">
        <UserInput
          id="bridgeInInputAmount"
          name="bridgeInInputAmount"
          onBlur={formik.handleBlur}
          value={bridgeInInputAmount}
          onChange={(e) => setBridgeInInputAmount(e.target.value)}
          label={
            <span>
              <label className="label">From:</label>&nbsp;
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
                onClick={() => setBridgeInInputAmount(BeautyAmount.from(selectedAsset).humanize())}
              >
                MAX:&nbsp;
                <HumanizeAmount asset={selectedAsset} />
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
              <label className="label">To:</label>&nbsp;
              {selectedAsset && <AssetSymbol info={selectedAsset?.shadow?.info} />}
            </span>
          }
          placeholder="0.0"
          disabled
          value={bridgeOutInputAmount}
        />
      </div>

      <Divider dashed style={{ margin: 0, padding: 0 }} />

      <div className="input-wrapper">
        <UserInput
          id="recipient"
          name="recipient"
          onBlur={formik.handleBlur}
          label={<span className="label">Recipient</span>}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Help {...statusOf('recipient')} />
      </div>

      <SubmitButton
        disabled={validateStatus !== 'success' && !enableApproveButton}
        block
        type="primary"
        size="large"
        onClick={formik.submitForm}
        allowanceStatus={allowance}
        isloading={isLoading}
      />
    </BridgeViewWrapper>
  );
};
