import React, { FC } from 'react';
import { Tag, TagProps } from 'antd';
import { StyledWrapTag } from './styles';
import { ColorList } from '@react/constants/color';

interface Props extends TagProps {
  children?: React.ReactNode;
  color: (typeof ColorList)[keyof typeof ColorList];
}

const CTag: FC<Props> = React.memo(({ children, color, ...rest }) => {
  return (
    <StyledWrapTag>
      <Tag bordered={false} {...rest} color={color}>
        {children}
      </Tag>
    </StyledWrapTag>
  );
});

export default CTag;
