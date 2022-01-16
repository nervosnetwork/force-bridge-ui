import { InputBase } from '@mui/material';
import styled from 'styled-components';

export const CustomInput = styled(InputBase)(
  ({ theme }) => `
    background-color: #232323;
    border: none;
    border-radius: 0.375rem;
    display:flex;
    transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid #232323;
    padding: 5px 12px;
    margin:0;

    :hover {
        border-color: #484D4E;
    }

    & .MuiButton-root {
        color:#edf2f2;
        background-color: rgba(72,77,78,0.5);
        padding:0.25rem 0.5rem;
        min-width: initial;
    }

    &.Mui-error {
        border-color: #9b18ef;
    }
    `,
);
