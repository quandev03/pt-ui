/* eslint-disable @typescript-eslint/ban-ts-comment */
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import { StyledWrapUpload } from '@react/commons/UploadFile/styles';
import { FILE_TYPE } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { Button, Col, Form, Row, Space, UploadFile, UploadProps } from 'antd';
import React, { useEffect, useState } from 'react';

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
  const form = Form.useFormInstance()

  useEffect(() => {
    if (error) {
      if (error === `${MESSAGE.G14} ${accept}`) {
        form.setFields([
          {
            name: 'fileProducts',
            errors: [error]
          }
        ])

      } else if (error === MESSAGE.G13) {
        form.setFields([
          {
            name: 'fileProducts',
            errors: ['File tải lên vượt quá 20MB']
          }
        ])
      }
    }
  }, [error]);
  const FILE_SIZE_MAX_DEFAULT = 20 * 1024 * 1024;

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
      } else if (file.size && file.size > FILE_SIZE_MAX_DEFAULT) {
        setError(MESSAGE.G18);
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
          <CButton className="w-[133px]" disabled={disabled}>Chọn file</CButton>
        )}
      </div>
    </StyledWrapUpload>
  );
};

export default CUpload;
