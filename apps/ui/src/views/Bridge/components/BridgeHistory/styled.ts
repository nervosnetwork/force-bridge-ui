import { Box, styled } from '@mui/material';

export const History = styled(Box)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100vw;
    max-width: 24rem;
    margin-top: 1rem;
    background-color: rgba(35, 35, 35, 0.5);
    backdrop-filter: blur(12px);
    border-radius: 0.5rem;
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
      color: #000000;
      align-items:center;
      .MuiButton-startIcon {
        color: #000000;
      }
    }
    .MuiOutlinedInput-root {
      width:94%;
      margin-bottom: 24px;
    }
    @media only screen and (min-width: 768px) {
        & {
            max-width: 32rem;
            width:512px;
        }
    }
  `,
);
