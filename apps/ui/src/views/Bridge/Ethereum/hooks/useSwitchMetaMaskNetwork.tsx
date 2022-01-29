import { utils } from '@force-bridge/commons';
import { Box, DialogContent, Typography } from '@mui/material';
import { useMutation, UseMutationResult } from 'react-query';
import { useDialog } from 'components/ConfirmMessage';
import { EthereumProviderContainer } from 'containers/EthereumProviderContainer';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';

export interface SwitchInputValues {
  chainId: string;
}

export function useSwitchMetaMaskNetwork(): UseMutationResult<void, unknown, SwitchInputValues> {
  const provider = EthereumProviderContainer.useContainer();
  const { network } = ForceBridgeContainer.useContainer();

  const [openDialog, closeDialog] = useDialog();
  const onOpenDialog = (description: string) => {
    const title = 'Switch MetaMask Network failed';
    const dialogContent = (
      <DialogContent>
        <Box flexDirection="column" alignItems="center">
          <Typography>{description}</Typography>
        </Box>
      </DialogContent>
    );
    openDialog({
      children: { title, dialogContent, closeDialog },
    });
  };

  return useMutation(
    ['switchMetaMaskNetwork'],
    async (input: SwitchInputValues) => {
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: input.chainId }]);
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          if (network === 'Bsc') {
            await provider.send('wallet_addEthereumChain', [
              {
                chainId: `0x${Number(process.env.REACT_APP_BSC_ENABLE_CHAIN_ID).toString(16)}`,
                chainName: process.env.REACT_APP_BSC_ENABLE_CHAIN_NAME,
                rpcUrls: [process.env.REACT_APP_BSC_RPC_URL],
                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                blockExplorerUrls: [process.env.REACT_APP_TX_EXPLORER_BSC.slice(0, -4)],
              },
            ]);
          }
          return;
        }
        throw switchError;
      }
    },
    {
      onError(error) {
        const errorMsg: string = utils.hasProp(error, 'message') ? String(error.message) : 'Unknown error';
        onOpenDialog(errorMsg);
      },
    },
  );
}
