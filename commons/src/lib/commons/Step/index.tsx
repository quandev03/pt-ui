import React, { FC } from 'react';
import { StepsProps } from 'antd';
import { StyledSteps } from './styles';

interface Props extends StepsProps {
  children?: React.ReactNode;
  items: any[];
}

const CSteps: FC<Props> = React.memo(({ children, items, ...rest }) => {
  return (
    <StyledSteps items={items} {...rest}>
      {children}
    </StyledSteps>
  );
});

export default CSteps;
