import { Accordion } from '@mui/material';
import styled from 'styled-components';

export const CustomizedAccordion = styled(Accordion)(
  ({ theme }) => `
    background-color: #232323;
    border-radius: 0.375rem;

    ::before {
        display:none;
    }

    & .MuiAccordionSummary-content {
      justify-content:center;
    }

    & .MuiDivider-root {
      margin: 0.5rem 0;
    }

    :last-of-type {
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  `,
);
