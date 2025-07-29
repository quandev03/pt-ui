import { UploadOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd';
import React from 'react';

type Props = {
  name: string;
  label: string;
};

export const FileUpload = ({ name, label }: Props) => {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="text-[#000000e0]">{label}</div>
      <Form.Item label="" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload action="/upload.do" listType="picture-card">
          <button style={{ border: 0, background: 'none' }} type="button">
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        </Upload>
      </Form.Item>
    </div>
  );
};
