import { IconButton, styled } from '@mui/material';

export const CustomizedIconButton = styled(IconButton)(
  ({ theme }) => `
    padding: 0;
    margin-left: 1rem;
    svg {
        width: 1.5rem;
        height: 1.5rem;
        padding: 0.5rem;
        background: #232323;
        color: #9ca3af;
        border-radius: 0.375rem;
    }
  `,
);
