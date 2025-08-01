import React, { FC, ReactNode } from 'react';
import { AnyElement } from '../../types';

type ShowConditionProps = {
  children: ReactNode;
};

const Show: FC<ShowConditionProps> & {
  When: FC<WhenProps>;
  Else: FC<ElseProps>;
} = ({ children }) => {
  let when: ReactNode | null = null;
  let otherwise: ReactNode | null = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if ((child.props as AnyElement).isTrue === undefined) {
        otherwise = child;
      } else if (!when && (child.props as AnyElement).isTrue) {
        when = child;
      }
    }
  });
  return when || otherwise;
};

interface WhenProps {
  isTrue: boolean;
  children: ReactNode;
}

Show.When = ({ isTrue, children }) => (isTrue ? children : null);

interface ElseProps {
  render?: ReactNode;
  children: ReactNode;
}

Show.Else = ({ render, children }) => render || children;

export { Show };
