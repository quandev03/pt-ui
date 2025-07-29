import { Button, CTable } from '@react/commons/index';
import { Text } from '@react/commons/Template/style';
import { AnyElement, RcFile } from '@react/commons/types';
import CUpload from '@react/commons/Upload';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { Col, Collapse, Form, Row, Tooltip } from 'antd';
import { CollapseProps } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Show from '../Template/Show';
import InputDescription from './InputDescription';
import Column from 'antd/lib/table/Column';
import { formatBytes } from '@react/helpers/utils';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const cleanUpString = (input: string) => {
  // Trim khoảng trắng đầu và cuối chuỗi
  const trimmedString = input.trim();

  // Thay thế nhiều khoảng trắng liên tiếp thành 1 khoảng trắng
  const cleanedString = trimmedString.replace(/\s\s+/g, ' ');

  return cleanedString;
};
const CCollapse = styled(Collapse)`
  .ant-collapse-header {
    display: flex;
    flex-direction: row-reverse;
  }
`;

export type FileType = File & {
  fileName: string;
};

export interface FileData {
  key: number;
  file: string;
  desc?: string;
  url?: string;
  error?: string;
  files?: FileType;
  id?: number;
  volume?: string;
  date?: string;
  name?: string;
  fileUrl?: string;
}

interface TableUploadFileProps {
  acceptedFileTypes?: string;
  onDownload?: (record: FileData) => void;
  disabled?: boolean;
  formName?: string;
  showAction?: boolean;
}

const normFile = (e: any) => {
  return e?.file;
};

const CTableUploadFile: React.FC<TableUploadFileProps> = ({
  acceptedFileTypes = '*',
  onDownload,
  disabled = false,
  formName = 'files',
  showAction = true,
}) => {
  const form = Form.useFormInstance();
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const dataTable = Form.useWatch(formName, form) ?? [];

  useEffect(() => {
    if (disabled) return;
    form.setFieldValue(formName, dataTable.length ? dataTable : [{}]);
  }, [disabled]);

  const handleUpload = (file: File, index: number) => {
    const currentFiles = form.getFieldValue(formName) || [];
    form.setFieldsValue({
      [formName]: currentFiles.map((item: AnyElement, idx: number) =>
        idx === index
          ? {
            ...item,
            files: file,
            name: file.name,
            size: file.size,
            date: dayjs(),
          }
          : item
      ),
    });
    return false;
  };

  const handleDownload = (record: FileData) => {
    if (onDownload) {
      onDownload(record);
    }
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Đính kèm',
      children: (
        <Form.List name={formName} initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <Row>
              <Col span={23}>
                <CTable
                  id="common-table"
                  dataSource={dataTable}
                  scroll={{ y: 'auto' }}
                  className="dynamic-table !w-full"
                  rowClassName="editable-row align-top"
                  pagination={false}
                >
                  <Column
                    width={50}
                    dataIndex="stt"
                    title={'STT'}
                    render={(_, __, index: number) => <Text>{index + 1}</Text>}
                  />
                  <Column
                    width={200}
                    dataIndex="files"
                    title={<FormattedMessage id="File đính kèm" />}
                    render={(
                      value: RcFile,
                      record: FileData,
                      index: number
                    ) => {
                      const isOverSize = value && value.size > MAX_FILE_SIZE;
                      const RenderContent = () => {
                        if (isOverSize || !record?.name) {
                          return (
                            <CUpload
                              showUploadList={false}
                              beforeUpload={(file) => handleUpload(file, index)}
                              accept={acceptedFileTypes}
                              multiple={false}
                              maxCount={1}
                            >
                              <Button className="w-[124px] h-[35px] rounded-[5px]">
                                Chọn file
                              </Button>
                            </CUpload>
                          );
                        } else {
                          const text = value?.name
                            ? value.name
                            : record?.name
                              ? record.name
                              : '';
                          return (
                            <Tooltip title={text} placement="topLeft">
                              <Text onClick={() => handleDownload(record)}>
                                <p
                                  className="w-max"
                                  style={
                                    onDownload && {
                                      color: 'rgb(59 130 246)',
                                      cursor: 'pointer',
                                    }
                                  }
                                >
                                  {text}
                                </p>
                              </Text>
                            </Tooltip>
                          );
                        }
                      };

                      return (
                        <div>
                          <Form.Item
                            name={[index, 'files']}
                            validateTrigger={['onChange', 'onBlur']}
                            getValueFromEvent={normFile}
                            rules={[
                              {
                                validator: async (_, value) => {
                                  if (value && value.size > MAX_FILE_SIZE) {
                                    return Promise.reject(
                                      'File tải lên vượt quá 5MB'
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            {RenderContent()}
                          </Form.Item>
                        </div>
                      );
                    }}
                  />
                  <Column
                    width={200}
                    dataIndex="size"
                    title={<FormattedMessage id="Dung lượng" />}
                    render={(text, __, index: number) => {
                      const value = text ? formatBytes(Number(text)) : '-';
                      return (
                        <Tooltip title={value} placement="topLeft">
                          <Text>{value}</Text>
                        </Tooltip>
                      );
                    }}
                  />
                  <Column
                    width={300}
                    dataIndex="desc"
                    title={'Mô tả'}
                    render={(text, __, index: number) => (
                      <InputDescription index={index} disabled={disabled} />
                    )}
                  />
                  <Column
                    width={200}
                    dataIndex="date"
                    title={'Ngày tạo'}
                    render={(value, __, index: number) => {
                      const text = value
                        ? dayjs(value).format(formatDate)
                        : '-';
                      const tooltip = value
                        ? dayjs(value).format(formatDateTime)
                        : '-';
                      return (
                        <Tooltip title={tooltip} placement="topLeft">
                          <Text>{text}</Text>
                        </Tooltip>
                      );
                    }}
                  />
                  <Column
                    width={50}
                    dataIndex="date"
                    title={''}
                    render={(
                      _: string,
                      __: Record<string, string>,
                      index: number
                    ) => (
                      <div className="flex">
                        <Show>
                          <Show.When isTrue={showAction}>
                            <FontAwesomeIcon
                              icon={faMinus}
                              onClick={() => {
                                if (!disabled) {
                                  remove(fields[index].name);
                                  form.setFields([
                                    {
                                      name: [
                                        formName,
                                        fields[index].name,
                                        'files',
                                      ],
                                      errors: [],
                                    },
                                  ]);
                                  if (fields.length === 1) {
                                    add();
                                  }
                                }
                              }}
                              className="mr-2 cursor-pointer"
                              size="lg"
                              title="Xóa"
                            />
                          </Show.When>
                        </Show>
                      </div>
                    )}
                  />
                </CTable>
              </Col>
              <Col span={1} className={'relative'}>
                <Show>
                  <Show.When isTrue={showAction}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      size="lg"
                      onClick={() => {
                        if (!disabled) {
                          add();
                        }
                      }}
                      className="cursor-pointer absolute bottom-1 left-5 mb-7"
                      title="Thêm"
                    />
                  </Show.When>
                </Show>
              </Col>
            </Row>
          )}
        </Form.List>
      ),
    },
  ];

  return <CCollapse items={items} />;
};

export default CTableUploadFile;
