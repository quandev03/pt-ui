import { Form } from 'antd';
import { CInput } from '../../Input';

export const SearchDefault = ({ placeholder }: { placeholder?: string }) => {
  return (
    <Form.Item name={'q'}>
      <CInput placeholder={placeholder} />
    </Form.Item>
  );
};
