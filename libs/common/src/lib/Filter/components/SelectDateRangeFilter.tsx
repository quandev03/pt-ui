import { SelectDateRangeFilterType } from '../types';
import { FormItemDateRange } from './FormItemDateRange';
import { FormItemSelect } from './FormItemSelect';

export const SelectDateRangeFilter = ({
  dateRange,
  select,
}: SelectDateRangeFilterType) => {
  return (
    <>
      <FormItemSelect {...select} />
      <FormItemDateRange {...dateRange} />
    </>
  );
};
