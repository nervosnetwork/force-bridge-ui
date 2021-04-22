import { QuestionOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';

type AssetSymbolInfo = {
  logoURI?: string;
  symbol?: string;
};
type AssetSymbolProps = AssetSymbolInfo | { info: AssetSymbolInfo };

const AssetSymbolWrapper = styled.span`
  .logo {
    margin: 0 4px;

    img {
      width: 1em;
      height: 1em;
    }
  }

  .symbol {
    font-weight: 700;
  }
`;

export const AssetSymbol: React.FC<React.HTMLAttributes<HTMLSpanElement> & AssetSymbolProps> = (props) => {
  const { logoURI, symbol = 'Unknown', ...wrapperProps } = 'info' in props ? props.info : props;

  const logo = logoURI ? <img className="logo" alt={symbol} src={logoURI} /> : <QuestionOutlined />;

  return (
    <AssetSymbolWrapper {...wrapperProps}>
      <span className="logo">{logo}</span>
      <span className="symbol">{symbol}</span>
    </AssetSymbolWrapper>
  );
};
