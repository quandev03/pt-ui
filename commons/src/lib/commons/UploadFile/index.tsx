/* eslint-disable @typescript-eslint/ban-ts-comment */
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FILE_TYPE, UploadFileMax } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { Col, Row, Space, UploadFile, UploadProps } from 'antd';
import React, { useEffect, useState } from 'react';
import Button from '../Button';
import { NotificationError } from '../Notification';
import { StyledWrapUpload } from './styles';
interface CUploadProps {
  // props using for Form.Item
  value?: UploadFile;
  onChange?: (value?: UploadFile) => void;
  handlePreview?: (value: UploadFile) => void;
}

export interface FileType {
  uid: string;
  name: string;
}

const props: UploadProps = {
  name: 'file',
  multiple: false,
  beforeUpload: () => false,
};

const checkFileType = (accept: string) => {
  const fileTypeList = [];
  if (/pdf/.test(accept)) {
    fileTypeList.push(FILE_TYPE.pdf);
  }
  if (/xlsx/.test(accept)) {
    fileTypeList.push(FILE_TYPE.xlsx);
  }
  return fileTypeList;
};

export const CUpload: React.FC<CUploadProps & UploadProps> = ({
  value,
  onChange,
  disabled,
  accept = '.pdf',
  multiple,
  ...rest
}) => {
  const [error, setError] = useState('');

  useEffect(() => {
    !!error && NotificationError(error);
  }, [error]);

  const handleChange: UploadProps['onChange'] = ({ fileList, file }) => {
    if (typeof onChange === 'function') {
      console.log(fileList, 'ccccc', file);
      if (
        accept &&
        file.lastModified &&
        !checkFileType(accept).includes(file.type || '')
      ) {
        setError(`${MESSAGE.G14} ${accept}`);
        return;
      } else if (file.size && file.size > UploadFileMax) {
        setError(MESSAGE.G13);
        return;
      }
      onChange(file);
    }
  };

  const handleRemove = () => {
    onChange!(undefined);
  };

  return (
    <StyledWrapUpload
      {...rest}
      {...props}
      accept={accept}
      // fileList={value}
      showUploadList={false}
      disabled={disabled}
      multiple={false}
      maxCount={1}
      onChange={handleChange}
    >
      <div onClick={() => setError('')}>
        {value ? (
          <Row justify="space-between">
            <Col span={22} className="custom-upload-list">
              <div
                key={value.uid}
                className="custom-upload-list-item"
                onClick={(e) => e.stopPropagation()}
              >
                <Space>
                  <div title={value.name} className="cursor-auto">
                    {value.name}
                  </div>
                  {
                    <Button
                      type="text"
                      size="small"
                      icon={
                        <FontAwesomeIcon
                          icon={faXmark}
                          size="sm"
                          color="#565771"
                        />
                      }
                      hidden={disabled}
                      onClick={() => handleRemove()}
                    />
                  }
                </Space>
              </div>
            </Col>
          </Row>
        ) : (
          <Button className="w-[133px]" disabled={disabled}>Chọn file</Button>
        )}
      </div>
    </StyledWrapUpload>
  );
};

export default CUpload;
