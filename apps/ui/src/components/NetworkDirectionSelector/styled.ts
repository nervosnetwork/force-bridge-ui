import { MenuItem, styled } from '@mui/material';

export const NetworkDirectionMenu = styled('div')(
  ({ theme }) => `
    display: flex;
    justify-content:center;
    .MuiButton-root {
        margin-bottom: 24px;
        width:227px;
    }
  `,
);

export const NetworkItem = styled(MenuItem)(
  ({ theme }) => `
    
    svg {
      width: 1.75rem;
      color: #484D4E;
    }
    .MuiAvatar-root {
      margin-right: 4px;
    }
  `,
);
