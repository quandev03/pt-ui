import React, { FC } from 'react';
import { Tag, TagProps } from 'antd';
import { StyledWrapTag } from './styles';
import { ColorList } from '@react/constants/color';
import CTooltip from '../Tooltip';
import { ModelStatus } from '../types';
import CTag from '.';

interface Props extends TagProps {
  value: number;
}

const CTagActive: FC<Props> = React.memo(({ value, color, ...rest }) => {
  return (
    <CTooltip title={value ? 'Hoạt động' : 'Không hoạt động'}>
      <CTag
        color={
          value === ModelStatus.ACTIVE ? ColorList.SUCCESS : ColorList.DEFAULT
        }
      >
        {value ? 'Hoạt động' : 'Không hoạt động'}
      </CTag>
    </CTooltip>
  );
});

export default CTagActive;
