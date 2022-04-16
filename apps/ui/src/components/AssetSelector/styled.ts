import { Select, styled } from '@mui/material';

export const CustomizedSelect = styled(Select)(
  ({ theme }) => `
    background-color: ${theme.palette.secondary.light};
    border: none;
    border-radius: 0.375rem;
    transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid ${theme.palette.secondary.light};

    :hover {
      border-color: ${theme.palette.text.secondary};
    }

    .MuiOutlinedInput-notchedOutline {
        border:none;
    }

    .MuiOutlinedInput-input {
      padding: 0.5rem 2.5rem 0.5rem 0.75rem;
      display:flex;
      flex-direction: row;
      align-items: center;
    }
  `,
);
