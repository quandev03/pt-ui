import { Form } from 'antd';
import React, { FC } from 'react';
import CTextArea from '../TextArea';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

type Props = {
  index: number;
  disabled: boolean;
};

const InputDescription: FC<Props> = ({ index, disabled }) => {
  const form = useFormInstance();
  return (
    <Form.Item name={[index, 'desc']} noStyle>
      <CTextArea
        placeholder="Nhập mô tả"
        onBlur={(e) => {
          const value = form.getFieldValue(['files', index, 'desc']);
          form.setFieldValue(['files', index, 'desc'], value.trim());
        }}
        maxLength={200}
        disabled={disabled}
        autoSize={{ minRows: 1, maxRows: 5 }}
      />
    </Form.Item>
  );
};

export default InputDescription;
