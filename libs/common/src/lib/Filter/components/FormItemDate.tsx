import { Form, Tooltip } from 'antd';
import { DateFilterType } from '../types';
import { CDatePicker } from '../../DatePicker';

export const FormItemDate = ({
  name,
  propsFormItem = {},
  stateKey,
  label,
  ...props
}: DateFilterType) => {
  return (
    <Tooltip title={label}>
      <Form.Item
        name={stateKey ? stateKey : name}
        className="w-48"
        {...propsFormItem}
      >
        <CDatePicker
          {...props}
          allowClear={props.defaultValue ? false : props.allowClear}
        />
      </Form.Item>
    </Tooltip>
  );
};
