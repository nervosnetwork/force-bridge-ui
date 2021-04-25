import { QuestionOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';

type AssetSymbolProps = {
  info?: {
    logoURI?: string;
    symbol?: string;
  };
};

const AssetSymbolWrapper = styled.span`
  display: inline-flex;
  align-items: center;

  .logo {
    margin: 0 4px;
    width: 1em;
    height: 1em;
  }

  .symbol {
    font-weight: 700;
  }
`;

export const AssetSymbol: React.FC<React.HTMLAttributes<HTMLSpanElement> & AssetSymbolProps> = (props) => {
  const { logoURI, symbol = 'Unknown', ...wrapperProps } = props.info ?? {};

  const logo = logoURI ? <img className="logo" alt={symbol} src={logoURI} /> : <QuestionOutlined className="logo" />;

  return (
    <AssetSymbolWrapper {...wrapperProps}>
      {logo}
      <span className="symbol">{symbol}</span>
    </AssetSymbolWrapper>
  );
};
