import styled from 'styled-components';

export const StyledCardWrapper = styled.div`
  width: 360px;
  padding: 24px;
  border-radius: 16px;
  background: ${(props) => props.theme.palette.common.white};
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.08);
`;
