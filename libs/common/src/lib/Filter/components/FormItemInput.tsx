import { Form, Tooltip } from 'antd';
import { InputFilterType } from '../types';
import { CInput } from '../../Input';

export const FormItemInput = ({
  name,
  propsFormItem = {},
  stateKey,
  label,
  tooltip,
  ...props
}: InputFilterType) => {
  return (
    <Tooltip title={tooltip ?? label}>
      <Form.Item
        name={stateKey ? stateKey : name}
        className="w-48"
        {...propsFormItem}
      >
        <CInput
          {...props}
          allowClear={props.defaultValue ? false : props.allowClear}
        />
      </Form.Item>
    </Tooltip>
  );
};
