import { Avatar, styled } from '@mui/material';

export const CustomizedAvatar = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.palette.primary.light};
    `,
);
