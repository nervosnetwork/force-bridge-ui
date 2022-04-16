import { IconButton, styled } from '@mui/material';

export const CustomizedIconButton = styled(IconButton)(
  ({ theme }) => `
    padding: 0;
    margin-left: 1rem;
    svg {
      width: 1.5rem;
      height: 1.5rem;
      padding: 0.5rem;
      background: ${theme.palette.secondary.light};
      color: #9ca3af;
      border-radius: 0.375rem;
    }
  `,
);

export const darkBox = `
  box-sizing: border-box;
  width: 100vw;
  max-width: 24rem;
  margin-top: 1rem;
  background-color: rgba(35, 35, 35, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 0.5rem;
  @media only screen and (min-width: 768px) {
    & {
      max-width: 32rem;
      width:512px;
    }
  }
`;
