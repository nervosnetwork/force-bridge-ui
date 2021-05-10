import { Button, ButtonProps } from 'antd';
import React from 'react';
import styled from 'styled-components';

export const StyledCardWrapper = styled.div`
  width: 360px;
  padding: 24px;
  border-radius: 16px;
  background: ${(props) => props.theme.palette.common.white};
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.08);
`;

export const LinearGradientButton: React.FC<ButtonProps> = styled(Button)`
  border: none;
  background: linear-gradient(93.35deg, #b8f0d5 3.85%, #b8f0ed 100%);

  :hover {
    color: ${(props) => props.theme.palette.common.black};
    background: linear-gradient(93.35deg, #b8f0d5 3.85%, #b8f0ed 100%);
  }

  :active {
    color: ${(props) => props.theme.palette.common.black};
    background: linear-gradient(93.35deg, #b8f0d5 3.85%, #b8f0ed 100%);
  }

  :focus {
    color: ${(props) => props.theme.palette.common.black};
    background: linear-gradient(93.35deg, #b8f0d5 3.85%, #b8f0ed 100%);
  }
`;
