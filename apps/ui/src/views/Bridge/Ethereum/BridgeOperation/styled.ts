import { Select } from '@mui/material';
import styled from 'styled-components';

export const CustomizedSelect = styled(Select)(
  ({ theme }) => `
    background-color: #232323;
    border: none;

    :hover {
      border-color: #484D4E;
    }

    & .MuiOutlinedInput-notchedOutline {
        transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
        border-color: #232323;
    }
  `,
);
