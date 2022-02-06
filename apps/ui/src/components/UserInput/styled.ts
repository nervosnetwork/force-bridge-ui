import { InputBase, styled } from '@mui/material';

export const CustomInput = styled(InputBase)(
  ({ theme }) => `
    background-color: ${theme.palette.secondary.light};
    border: none;
    border-radius: 0.375rem;
    display:flex;
    transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid ${theme.palette.secondary.light};
    padding: 5px 12px;
    margin:0;

    :hover {
        border-color: ${theme.palette.text.secondary};
    }

    & .MuiButton-root {
        color:#edf2f2;
        background-color: ${theme.palette.text.secondary};
        padding:0.25rem 0.5rem;
        min-width: initial;
    }

    &.Mui-error {
        border-color: ${theme.palette.info.main};
    }
    `,
);
