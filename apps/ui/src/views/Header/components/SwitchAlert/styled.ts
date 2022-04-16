import { Alert, styled } from '@mui/material';

export const CustomizedAlert = styled(Alert)(
  () => `
    max-width: 80rem;
    margin: 8px auto 0 auto;
    padding: 0 8px;
  `,
);
