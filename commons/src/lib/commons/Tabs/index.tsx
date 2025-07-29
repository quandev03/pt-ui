import React, { FC } from 'react';
import { Tabs, TabsProps } from 'antd';
import { StyledWrapTabs } from './styles';

interface Props extends TabsProps {
  children?: React.ReactNode;
}

const CTabs: FC<Props> = React.memo(({ children, ...rest }) => {
  return (
    <StyledWrapTabs>
      <Tabs {...rest}>{children}</Tabs>
    </StyledWrapTabs>
  );
});

export default CTabs;
