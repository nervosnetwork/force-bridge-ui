import { styled } from '@mui/material';
import image from 'assets/images/cell-pattern-static.webp';

export const AppContainer = styled('div')(
  () => `
    background: url(${image}) center no-repeat fixed;
    background-size: cover;
    min-height: 100vh;
      & .MuiContainer-root {
      padding-top: 7.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;   
  }`,
);
