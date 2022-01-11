import React from 'react';
import { ReactComponent as Bsc } from './bsc.svg';
import { ReactComponent as Bitcoin } from './btc.svg';
import { ReactComponent as Ethereum } from './eth.svg';
import { ReactComponent as Nervos } from './nervos.svg';
import { ReactComponent as Tron } from './tron.svg';

export const Icons: Record<string, React.FC> = { Ethereum, Bitcoin, Tron, Nervos, Bsc };
