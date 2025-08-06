import { StyledSpan } from './style';
import React, { FC } from 'react';

export const CSpan: FC<React.HTMLAttributes<HTMLSpanElement>> = React.memo(
  ({ ...rest }) => {
    return <StyledSpan {...rest}></StyledSpan>;
  }
);
export const CTextInfo = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <strong className={`text-base text-[#2C3D94] font-bold ${className}`}>
      {children}
    </strong>
  );
};
