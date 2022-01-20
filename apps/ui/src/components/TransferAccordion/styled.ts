import { ExclamationIcon } from '@heroicons/react/outline';
import { Accordion, styled } from '@mui/material';

export const CustomizedAccordion = styled(Accordion)(
  ({ theme }) => `
    background: #232323;
    border-radius: 0.375rem;

    ::before {
        display:none;
    }

    & .MuiAccordionSummary-content {
      justify-content:center;
    }

    :last-of-type {
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  `,
);

export const CustomizedExclamationIcon = styled(ExclamationIcon)(
  ({ theme }) => `
    width: 1.25rem;
    height: 1.25rem;
    color: ${theme.palette.info.main};
    margin-bottom: 0.25rem;
  `,
);
