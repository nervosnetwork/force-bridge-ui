import { styled } from '@mui/material';

export const Switcher = styled('div')(
  ({ theme }) => `
    .MuiGrid-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        .bg-gradient {
        padding: 0.125rem;
        position: relative;
        background: linear-gradient(to right, #00cc9b, #18efb1);
        border-radius: 9999px;
        line-height: 1px;
            .MuiAvatar-root {
                width: 80px;
                height: 80px;
                background-color: #000000;
            }
        }
        .MuiButton-root {
        margin-top: 0.25rem;
        padding: 0.125rem 0.5rem;
        background-color: #ffffff1a;
        color: #edf2f2;
        transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
            &:hover {
                background: #00cc9b;
                color: #000000;
            }
        }

        svg {
        width: 2.5rem;
        margin: 2rem 3rem 0 3rem;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        color: #00cc9b;
        }

        @keyframes pulse {
            0%,
            100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
    }
  `,
);
