import { Form, Tooltip, TreeSelect } from 'antd';
import { TreeSelectFilterType } from '../types';

export const FormItemTreeSelect = ({
  name,
  propsFormItem = {},
  stateKey,
  label,
  ...props
}: TreeSelectFilterType) => {
  return (
    <Tooltip title={label}>
      <Form.Item
        name={stateKey ? stateKey : name}
        className="w-48"
        {...propsFormItem}
      >
        <TreeSelect
          {...props}
          allowClear={props.defaultValue ? false : props.allowClear}
        />
      </Form.Item>
    </Tooltip>
  );
};
