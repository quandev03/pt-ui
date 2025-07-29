import * as React from 'react';
import { StyledCol, StyledColProps } from './styles';
import { ColProps } from 'antd';

const CCol: React.FC<ColProps & StyledColProps> = ({ children, ...rest }) => {
  return <StyledCol {...rest}>{children}</StyledCol>;
};

export default CCol;
