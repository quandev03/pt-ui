import { CFilterParams } from './CFilterParams';
import { CFilterState } from './CFilterState';
import { FilterProps } from './types';
import { memo } from 'react';

export const CFilter = memo(
  ({ onChangeState, stateValues, ...rest }: FilterProps) => {
    if (onChangeState && stateValues) {
      return (
        <CFilterState
          onChangeState={onChangeState}
          stateValues={stateValues}
          {...rest}
        />
      );
    }

    return <CFilterParams {...rest} />;
  }
);
