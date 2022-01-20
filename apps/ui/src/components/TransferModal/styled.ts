import { Dialog, styled } from '@mui/material';
import nervosLogo from '../../assets/images/nervos-logo-mark-transparent.png';

export const CustomizedDialog = styled(Dialog)(
  ({ theme }) => `
    .MuiDialog-paper {
        box-sizing: border-box;
        background: #232323;
        border-radius: 0.5rem;
        padding: 1.5rem;
        max-width: 24rem;
        width:100vw;
        margin:0 1.5rem;

        .MuiBox-root {
          display:flex;
          justify-content:center;
        }

        .MuiDialogContent-root {
          display:flex;
          justify-content:center;
          align-items: center;
          svg {
            color: ${theme.palette.secondary.main};
            width:1rem;
            height:1rem;
            margin: 0 0.25rem;
          }
        }

        .MuiDialogActions-root {
          margin-top:1rem;
          .MuiButton-root {
            font-size: 14px;
            padding: 9px 16px;
            line-height: 1.25rem;
            :first-of-type {
              color: #232323;
              background-color: #ffffff;
              margin-right:0.25rem;
            }
          }
        }

        .MuiGrid-container {
          padding:0 1.5rem;
          margin-top:0.5rem;
        }
    
        .MuiDivider-root {
          margin: 0.5rem 1.5rem;
        }    
    }

    @media only screen and (min-width: 768px) {
      .MuiDialog-paper {
          max-width: 32rem;
          width:512px;
      }
    }

    @media only screen and (max-width: 640px) {
      .MuiDialogActions-root {
        flex-direction:column;
        .MuiButton-root {
          margin-top:0.75rem;
          margin-left:0;
        }
      }
    }

  `,
);

export const LoadingAnimation = styled('img')(
  ({ theme }) => `
    background: url('${nervosLogo}');
    background-size:contain;
    width:160px;
    height:160px;
  `,
);
