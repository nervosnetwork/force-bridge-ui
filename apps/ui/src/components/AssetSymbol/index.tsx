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
  const { logoURI, symbol = 'Unknown', ...wrapperProps } = props.info ?? {};

  const logo = logoURI ? <img alt={symbol} src={logoURI} /> : <QuestionOutlined />;

  return (
    <AssetSymbolWrapper {...wrapperProps}>
      <span className="logo">{logo}</span>
      <span className="symbol">{symbol}</span>
    </AssetSymbolWrapper>
  );
};
