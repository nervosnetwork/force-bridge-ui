import { Accordion, styled } from '@mui/material';

export const CustomizedAccordion = styled(Accordion)(
  ({ theme }) => `
    background: ${theme.palette.secondary.light};
    border-radius: 0.375rem;

    ::before {
        display:none;
    }

    .MuiAccordionSummary-content {
      justify-content:center;
    }

    :last-of-type {
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  `,
);
