import { styled } from '@mui/material';
import { darkBox } from 'shared-styled/styled';

export const Transfer = styled('div')(
  ({ theme }) => `
    padding: 2rem 1rem;
    ${darkBox}
    & .MuiButton-root {
      font-weight: 600;
      color: ${theme.palette.primary.dark};
      .MuiButton-startIcon {
        color: ${theme.palette.primary.dark};
      }
    }
  `,
);

export const ForceBridgeLogo = styled('img')(
  () => `
    width: 180px;
    height: 100%;
  `,
);
