import { DateFormat } from '@react/constants/app';
import { DatePicker, Form } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { FC, FocusEvent, useState } from 'react';

const { RangePicker } = DatePicker;
const CRangPickerInMonth: FC<RangePickerProps> = ({
  id,
  children,
  onBlur,
  style,
  ...res
}) => {
  const form = Form.useFormInstance();
  const field = id as string;
  const handleBlur = (
    e: FocusEvent<HTMLElement>,
    info: {
      range?: 'start' | 'end';
    }
  ) => {
    form && form?.validateFields([field]);
    onBlur && onBlur(e, info);
  };
  const [dates, setDates] = useState<Dayjs[]>([]);
  const [value, setValue] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'month'),
    dayjs(),
  ]);

  const disabledDate = (current: Dayjs | null): boolean => {
    if (!current) return false;

    if (!dates || dates.length === 0) {
      return current && current > dayjs().endOf('day');
    }
    const tooLate = dates[0] && current > dates[0].add(1, 'month');
    const tooEarly = dates[0] && current < dates[0].subtract(1, 'month');
    return tooLate || tooEarly || current > dayjs().endOf('day');
  };

  return (
    <RangePicker
      value={value}
      onCalendarChange={(val) => setDates((val as Dayjs[]) ?? [])}
      onChange={(val) => setValue(val as [Dayjs, Dayjs])}
      disabledDate={disabledDate}
      defaultValue={[dayjs().subtract(1, 'month'), dayjs()]}
      onBlur={handleBlur}
      format={DateFormat.DEFAULT}
      {...res}
    />
  );
};

export default CRangPickerInMonth;
