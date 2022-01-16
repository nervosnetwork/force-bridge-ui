import { AppBar } from '@mui/material';
import styled from 'styled-components';

export const CustomizedAppBar = styled(AppBar)(
  ({ theme }) => `
    background: rgba(0, 0, 0, 0.95);

    & .MuiToolbar-root {
        max-width: 80rem;
        margin: 0 auto;
      }
    img {
      height: 40px;
    }
    .MuiList-root {
      display:flex;
      .MuiMenuItem-root {
        color: #6b7280;
        display: flex;
        margin-left: 2.5rem;
        transition: all 600ms cubic-bezier(0.645, 0.045, 0.095, 1.08);
        padding:0;
    
        svg {
          width: 1rem;
          margin-right: 0.25rem;
        }
    
        p {
          font-weight: 500;
        }
    
        &:hover {
          color: #edf2f2;
          cursor: pointer;
        }
      }
    }
    
    .MuiButton-root {
      float: right;
    }
    `,
);
