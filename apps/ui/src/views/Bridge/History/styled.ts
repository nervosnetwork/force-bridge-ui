import { Box, styled } from '@mui/material';
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
      margin: 16px 0 144px 0;
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
