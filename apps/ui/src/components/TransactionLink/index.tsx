import React from 'react';
import styled from 'styled-components';

const LinkWrapper = styled.a`
  text-decoration: underline;
`;

interface TransactionLinkProps {
  network: string;
  txId: string;
}

export const TransactionLink: React.FC<TransactionLinkProps> = (props) => {
  const { network, txId } = props;
  // TODO refactor to UIModule
  let href = '';
  if (network === 'Nervos') href = process.env.REACT_APP_TX_EXPLORER_NERVOS + `${txId}`;
  if (network === 'Ethereum') href = process.env.REACT_APP_TX_EXPLORER_ETHEREUM + `${txId}`;
  if (network === 'Bsc') href = process.env.REACT_APP_TX_EXPLORER_BSC + `${txId}`;

  return (
    <LinkWrapper href={href} target="_blank" rel="noreferrer">
      {props.children}
    </LinkWrapper>
  );
};
