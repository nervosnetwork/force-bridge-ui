import { ExclamationIcon } from '@heroicons/react/outline';
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

export const CustomizedExclamationIcon = styled(ExclamationIcon)(
  ({ theme }) => `
    width: 1.25rem;
    height: 1.25rem;
    color: ${theme.palette.info.main};
    margin-bottom: 0.25rem;
  `,
);
