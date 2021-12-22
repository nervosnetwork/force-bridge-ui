import Icon from '@ant-design/icons';
import { Button, Divider, Row, Spin } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAllowance } from '../hooks/useAllowance';
import { useApproveTransaction } from '../hooks/useApproveTransaction';
import { BridgeReminder } from './BridgeReminder';
import { RecipientButton } from './RecipientButton';
import { SubmitButton } from './SubmitButton';
import { ReactComponent as BridgeDirectionIcon } from './resources/icon-bridge-direction.svg';
import { useAutoSetBridgeToAmount } from './useAutoSetBridgeToAmount';
import { HumanizeAmount } from 'components/AssetAmount';
import { AssetSelector } from 'components/AssetSelector';
import { AssetSymbol } from 'components/AssetSymbol';
import { StyledCardWrapper } from 'components/Styled';
import { UserInput } from 'components/UserInput';
import { WalletConnectorButton } from 'components/WalletConnector';
import { Box, MenuItem, Typography } from '@mui/material';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { useBridgeFeeQuery, useValidateBridgeOperationForm, ValidateResult } from 'hooks/bridge-operation';
import { useAssetQuery } from 'hooks/useAssetQuery';
import { useSearchParams } from 'hooks/useSearchParams';
import { BeautyAmount } from 'libs';
import { useSelectBridgeAsset } from 'views/Bridge/hooks/useSelectBridgeAsset';
import { useSendBridgeTransaction } from 'views/Bridge/hooks/useSendBridgeTransaction';
import { NetworkDirectionSelector } from 'views/Header/NetworkDirectionSelector';
import forcebridge from '../../../../assets/images/forcebridge-white.png';
import '../../../../assets/styles/transfer.scss';
import { CustomizedSelect } from './styled';

const HelpWrapper = styled(Typography)`
  padding-left: 8px;
`;

const Help: React.FC<{ validateStatus: 'error' | ''; help?: string }> = ({ validateStatus, help }) => {
  if (validateStatus !== 'error') return null;
  return <HelpWrapper type="danger">{help}</HelpWrapper>;
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
  } = ForceBridgeContainer.useContainer();
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

  return (
    <>
      <img src={forcebridge} />
      <Box className="transfer">
        <NetworkDirectionSelector
          networks={supportedNetworks}
          network={network}
          direction={direction}
          onSelect={({ network, direction }) => {
            switchNetwork(network);
            switchBridgeDirection(direction);
          }}
        />
        <Typography color="text.primary" variant="body1" marginTop={3} marginBottom={1}>
          Asset
        </Typography>
        <CustomizedSelect fullWidth labelId="demo-simple-select-label" id="demo-simple-select" label="Age">
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </CustomizedSelect>
        <div className="input-wrapper">
          <UserInput
            id="bridgeInInputAmount"
            name="bridgeInInputAmount"
            onBlur={formik.handleBlur}
            value={bridgeFromAmount}
            onChange={(e) => setBridgeFromAmount(e.target.value)}
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
                  onClick={() => setBridgeFromAmount(BeautyAmount.from(selectedAsset).humanize({ separator: false }))}
                >
                  Max:&nbsp;
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
            label={<span className="label">Recipient:</span>}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            extra={signer && <RecipientButton setRecipient={setRecipient} signer={signer} direction={direction} />}
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

        <BridgeReminder />
      </Box>
    </>
  );
};
