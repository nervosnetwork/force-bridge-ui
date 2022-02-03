import { styled } from '@mui/material';

export const NervosLogo = styled('img')(
  () => `
    opacity: 0.4;
    width: 48px;
    transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);

    :hover {
      opacity:1;
    }
  `,
);
