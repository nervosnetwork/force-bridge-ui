import { MenuItem, styled } from '@mui/material';

export const NetworkDirectionMenu = styled('div')(
  () => `
    display: flex;
    justify-content:center;
    .MuiButton-root {
        width:227px;
    }
  `,
);

export const NetworkItem = styled(MenuItem)(
  ({ theme }) => `
    
    svg {
      width: 1.75rem;
      color: ${theme.palette.text.secondary};
    }
    .MuiAvatar-root {
      margin-right: 4px;
    }
  `,
);
