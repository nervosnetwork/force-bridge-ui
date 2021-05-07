import { Tooltip, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { truncateMiddle } from 'utils';

const AddressTip = styled(Typography.Text)`
  color: ${(props) => props.theme.palette.common.white};
`;

interface UserIdentProps {
  ident: string;
  truncateLength?: number;
}

export const UserIdent: React.FC<UserIdentProps> = ({ ident, truncateLength = 10 }) => {
  return <Tooltip title={<AddressTip copyable>{ident}</AddressTip>}>{truncateMiddle(ident, truncateLength)}</Tooltip>;
};
