import { FC, ReactNode } from 'react';
import { AnyElement } from '../../types';
import { CTooltip } from '../Tooltip';
import { Text } from '../Template';

interface RenderCellProps {
  value?: ReactNode;
  tooltip?: ReactNode;
  disabled?: boolean;
  type?: string;
}

export const RenderCell: FC<RenderCellProps> = ({
  value,
  tooltip,
  disabled,
  type,
}) => (
  <CTooltip title={tooltip ?? value}>
    <Text disabled={disabled} type={type as AnyElement} width={'15'}>
      {value}
    </Text>
  </CTooltip>
);
