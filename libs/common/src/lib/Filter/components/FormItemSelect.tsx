import { Form, Tooltip } from 'antd';
import { SelectFilterType } from '../types';
import { CSelect } from '../../Select';

export const FormItemSelect = ({
  name,
  propsFormItem = {},
  stateKey,
  label,
  ...props
}: SelectFilterType) => {
  return (
    <Tooltip title={label}>
      <Form.Item
        name={stateKey ? stateKey : name}
        className="w-48"
        {...propsFormItem}
      >
        <CSelect
          {...props}
          allowClear={props.defaultValue ? false : props.allowClear}
        />
      </Form.Item>
    </Tooltip>
  );
};
