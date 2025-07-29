import { Col } from 'antd';
import styled, { css } from 'styled-components';

interface BreakpointProps {
  flex?: number;
}

export interface StyledColProps {
  xs?: number | BreakpointProps;
  sm?: number | BreakpointProps;
  md?: number | BreakpointProps;
  lg?: number | BreakpointProps;
  xl?: number | BreakpointProps;
  xxl?: number | BreakpointProps;
}

const generateMediaQuery = (size: number, prop: number | BreakpointProps) => {
  const value = typeof prop !== 'object' ? `${prop / 24}%` : prop.flex ? `${prop.flex}%` : '100%';
  return css`
    @media (min-width: ${size}px) {
      flex: 0 0 ${value};
      max-width: ${value};
    }
  `;
};

export const StyledCol = styled(Col)<StyledColProps>`
  ${({ xs }) => xs && generateMediaQuery(0, xs)}
  ${({ sm }) => sm && generateMediaQuery(576, sm)}
  ${({ md }) => md && generateMediaQuery(768, md)}
  ${({ lg }) => lg && generateMediaQuery(992, lg)}
  ${({ xl }) => xl && generateMediaQuery(1200, xl)}
  ${({ xxl }) => xxl && generateMediaQuery(1600, xxl)}
`;
