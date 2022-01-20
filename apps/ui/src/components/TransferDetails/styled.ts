import { styled } from '@mui/material';

export const Details = styled('div')(
  ({ theme }) => `
    p {
        font-size:16px;
    }

    & .MuiDivider-root {
      margin: 0.5rem 0;
    }
  `,
);
