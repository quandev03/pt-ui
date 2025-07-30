import { Form, Tooltip } from 'antd';
import { DateRangeFilterType } from '../types';
import dayjs, { Dayjs } from 'dayjs';
import { CRangePicker } from '../../DatePicker';

export const FormItemDateRange = ({
  name,
  propsFormItem = {},
  stateKey,
  label,
  disabledDate,
  disabledFutureDate,
  ...props
}: DateRangeFilterType) => {
  const isFutureDateDisabled = (current: Dayjs) => {
    return current && current > dayjs().endOf('day');
  };
  return (
    <Tooltip title={label}>
      <Form.Item
        name={stateKey ? stateKey : name}
        className="w-72"
        {...propsFormItem}
      >
        <CRangePicker
          {...props}
          disabledDate={
            disabledDate
              ? disabledDate
              : disabledFutureDate
              ? isFutureDateDisabled
              : undefined
          }
        />
      </Form.Item>
    </Tooltip>
  );
};
