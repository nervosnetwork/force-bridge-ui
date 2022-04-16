import { Link } from '@mui/material';
import React from 'react';
import { formatAddress } from 'utils';

interface AddressLinkProps {
  address: string;
  network: string;
}

export const AddressLink: React.FC<AddressLinkProps> = (props) => {
  const { address, network } = props;
  // TODO refactor to UIModule
  let href = '';
  if (network === 'Nervos') href = process.env.REACT_APP_ADDRESS_EXPLORER_NERVOS + `${address}`;
  if (network === 'Ethereum') href = process.env.REACT_APP_ADDRESS_EXPLORER_ETHEREUM + `${address}`;
  if (network === 'Bsc') href = process.env.REACT_APP_ADDRESS_EXPLORER_BSC + `${address}`;

  return address ? (
    <Link href={href} color="primary.light" target="_blank" rel="noreferrer">
      {formatAddress(address)}
    </Link>
  ) : (
    <span>...</span>
  );
};
