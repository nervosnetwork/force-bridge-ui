import { Box, Table, styled } from '@mui/material';
import { darkBox } from 'shared-styled/styled';

export const History = styled(Box)(
  ({ theme }) => `
    ${darkBox}
    .MuiGrid-container {
      padding: 1rem 0.5rem 1rem 0.75rem;
      align-items:center;
      &:not(:first-of-type) {
        border-top: 1px solid ${theme.palette.secondary.light};
      }
      .MuiGrid-item {
        padding:0 0.5rem;
      }
    }
    
    svg {
      width: 1.75rem;
      color: ${theme.palette.text.secondary}
    }
    .status-icon {
      width: 1.25rem;
    }
    .status-icon-green {
      width: 1.25rem;
      color: #34D399;
    }
    & .MuiButton-root {
      margin: 24px 0 0 0;
      font-weight: 600;
      color: ${theme.palette.primary.dark};
      align-items:center;
      .MuiButton-startIcon svg {
        color: ${theme.palette.primary.dark};
      }
    }
    .MuiButton-containedSizeSmall{
      margin:0;
      line-height: 1.25;
    }
    .MuiOutlinedInput-root {
      width:94%;
      margin-bottom: 24px;
    }
  `,
);

export const CustomizedTable = styled(Table)(
  ({ theme }) => `
    .MuiTableCell-root {
      border-bottom: none;
      padding: 16px 0;
      &:first-of-type {
        padding-left: 16px;
      }
      &:last-child {
        padding-right: 16px;
      }
    }
    .MuiTableRow-root {
      width: 100%;
      padding: 0 16px;
      &:nth-of-type(odd):not(:last-child) {
        display: table;
        border-top: 1px solid ${theme.palette.secondary.light};
      };
      &:nth-of-type(even) .MuiTableCell-root {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        padding: 0 16px 16px 16px;
      };
    };
    .MuiTableFooter-root {
      border-top: 1px solid ${theme.palette.secondary.light};
    }
    @media only screen and (max-width: 768px) {
        .MuiTableCell-root {
          padding: 16px;
        }
    }
  `,
);
