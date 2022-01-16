import { Paper, styled } from '@mui/material';

export const CustomizedExpandedMenu = styled(Paper)(
  ({ theme }) => `
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.95);
  border-radius: initial;
  z-index: 1101;
  display: block;

  & .MuiGrid-container {
    padding: 4rem 2rem;
    margin: 0 auto;
    max-width: 80rem;

    .MuiBox-root {
      justify-content: space-between;
      padding: 0.75rem;
      margin-bottom: 1rem;
    }

    .item-icon {
      width: 3rem;
      height: 3rem;
      background-color: #00cc9b;
      border-radius: 0.375rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      svg {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    img {
      height: 40px;
    }

    .MuiLink-root {
      transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 0.5rem;
      padding: 0.75rem;
      &:hover {
        background: #232323;
        cursor: pointer;
      }
    }

    .MuiTypography-body1 {
      margin-top: 1rem;
    }

    .MuiTypography-body2 {
      margin-top: 0.25rem;
    }
  }
  
  @media only screen and (max-width: 900px) {
    & {
      top: 0;
      background-color: #000000;
      border-radius: 0.5rem;
      margin: 0 0.5rem;

      .MuiGrid-container {
        padding: 1.25rem;
        width: auto;
        p {
          margin-left: 1rem;
        }
      }
    }
  }
  `,
);
