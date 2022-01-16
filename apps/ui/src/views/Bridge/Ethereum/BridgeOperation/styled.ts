import { styled } from '@mui/material';

export const Transfer = styled('div')(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100vw;
    max-width: 24rem;
    margin-top: 1rem;
    padding: 2rem 1rem;
    background-color: rgba(35, 35, 35, 0.5);
    backdrop-filter: blur(12px);
    border-radius: 0.5rem;
    & .MuiButton-root {
      font-weight: 600;
      color: #000000;
      .MuiButton-startIcon {
        color: #000000;
      }
    }
    @media only screen and (min-width: 768px) {
        & {
            max-width: 32rem;
            width:512px;
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
