import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, CSelect, CTable } from '@react/commons/index';
import Show from '@react/commons/Template/Show';
import { Text } from '@react/commons/Template/style';
import { AnyElement, IParamsRequest } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { Col, Form, Row, Tooltip } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useGetAllUser } from 'apps/Internal/src/hooks/useGetAllUser';
import React, { useCallback, useMemo, useState } from 'react';
import { TableType } from '../type';
import ModalSelectedUser from './ModalSelectedUser';
export const cleanUpString = (input: string) => {
  // Trim khoảng trắng đầu và cuối chuỗi
  const trimmedString = input.trim();

  // Thay thế nhiều khoảng trắng liên tiếp thành 1 khoảng trắng
  const cleanedString = trimmedString.replace(/\s\s+/g, ' ');

  return cleanedString;
};

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
}
interface TableUploadFileProps {
  typeModal: string;
  disabled?: boolean;
}
const CTableSelectedUser: React.FC<TableUploadFileProps> = ({
  typeModal,
  disabled,
}) => {
  const form = Form.useFormInstance();
  const stockIsdnOrgPermissionDTOS: any[] =
    useWatch('stockIsdnOrgPermissionDTOS', form) ?? [];
  const [openSelectUser, setOpenSelectUser] = useState<boolean>(false);

  const { data: dataUsers } = useGetAllUser();
  const optionUsers = useMemo(() => {
    if (!dataUsers) return [];
    return dataUsers.map((item) => ({
      label: item.username,
      value: item.id,
      fullname: item.fullname,
      userName: item.username,
      disabled: stockIsdnOrgPermissionDTOS.some(
        (stockIsdnOrgPermissionDTO) =>
          stockIsdnOrgPermissionDTO.userId === item.id
      ),
    }));
  }, [dataUsers, stockIsdnOrgPermissionDTOS]);

  const handleChange = useCallback(
    (value: string, option: AnyElement, index: number) => {
      const updatedFiles =
        form.getFieldValue('stockIsdnOrgPermissionDTOS') || [];
      const newValue = {
        userId: option.value,
        userName: option.userName,
        userFullName: option.fullname,
      };
      updatedFiles[index] = { ...updatedFiles[index], ...newValue };
      form.setFieldValue('stockIsdnOrgPermissionDTOS', updatedFiles);
    },
    [form]
  );

  const getColumnTableAddUser = (
    params: IParamsRequest
  ): ColumnsType<TableType> => {
    return [
      {
        title: 'STT',
        align: 'left',
        width: 50,
        fixed: 'left',
        render(_, record, index) {
          return <Text>{index + 1 + params.page * params.size}</Text>;
        },
      },
      {
        title: 'Username',
        dataIndex: 'userId',
        align: 'left',
        width: 200,
        render(value: string, record, index) {
          return (
            <Form.Item
              className="w-full"
              name={[index, 'userId']}
              rules={[
                {
                  required: true,
                  message: MESSAGE.G06,
                },
              ]}
            >
              <CSelect
                options={optionUsers}
                onChange={(value, option) => handleChange(value, option, index)}
              />
            </Form.Item>
          );
        },
      },
      {
        title: 'Tên user',
        dataIndex: 'userName',
        align: 'left',
        width: 200,
        render(value: string, record, index) {
          return (
            <Tooltip placement="topLeft" title={value}>
              <Form.Item name={[index, 'fullname']}>
                <Text>{value}</Text>
              </Form.Item>
            </Tooltip>
          );
        },
      },
    ];
  };
  console.log(stockIsdnOrgPermissionDTOS);
  return (
    <>
      <Form.List name={'stockIsdnOrgPermissionDTOS'}>
        {(fields, { add, remove }) => (
          <>
            <Col className="flex justify-between items-center mb-6" span={24}>
              <strong className="text-base">
                Phân quyền tác động kho số cho đơn vị nội bộ
              </strong>
              <Show>
                <Show.When isTrue={typeModal !== ActionType.VIEW}>
                  <Button
                    onClick={() => {
                      setOpenSelectUser(true);
                    }}
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    disabled={disabled}
                  >
                    Thêm User
                  </Button>
                </Show.When>
              </Show>
            </Col>
            <Row>
              <Col span={23}>
                <CTable
                  id="common-table"
                  className="dynamic-table !w-full"
                  dataSource={
                    form.getFieldValue('stockIsdnOrgPermissionDTOS') || []
                  }
                  columns={[
                    ...(getColumnTableAddUser({ page: 0, size: 20 }) || []),
                    {
                      width: 80,
                      title: '',
                      dataIndex: 'action',
                      render: (_: any, __: any, index: number) => (
                        <div className="flex justify-end">
                          <Show>
                            <Show.When isTrue={!disabled}>
                              <FontAwesomeIcon
                                icon={faMinus}
                                onClick={() => {
                                  if (!disabled) {
                                    remove(fields[index].name);
                                    form.setFields([
                                      {
                                        name: [
                                          'stockIsdnOrgPermissionDTOS',
                                          fields[index].name,
                                          'username',
                                        ],
                                        errors: [],
                                      },
                                    ]);
                                  }
                                }}
                                className="mr-2 cursor-pointer"
                                size="lg"
                                title="Xóa"
                              />
                            </Show.When>
                          </Show>
                        </div>
                      ),
                    },
                  ]}
                  scroll={{ y: '320px' }}
                  rowClassName="editable-row"
                  pagination={false}
                />
              </Col>
              <Col span={1} className={'relative'}>
                <Show>
                  <Show.When isTrue={typeModal !== ActionType.VIEW}>
                    <div>
                      <FontAwesomeIcon
                        fontSize={18}
                        icon={faPlus}
                        onClick={() => {
                          add({
                            userId: '',
                            userName: '',
                            userFullName: '',
                          });
                        }}
                        title="Thêm"
                        className="cursor-pointer absolute bottom-1 left-5 mb-6"
                      />
                    </div>
                  </Show.When>
                </Show>
              </Col>
            </Row>
          </>
        )}
      </Form.List>
      <ModalSelectedUser
        open={openSelectUser}
        onClose={() => setOpenSelectUser(false)}
        onSave={(data) => {
          const oldValue: TableType[] =
            form.getFieldValue('stockIsdnOrgPermissionDTOS') ?? [];
          const uniqueUserIds = new Set(oldValue.map((item) => item.userId));
          const newValue = data
            .filter((item) => !!item)
            .filter((item) => !uniqueUserIds.has(item.id))
            .map((item) => ({
              userId: item?.id,
              userName: item?.fullname,
              userFullName: item?.username,
            }));

          form.setFieldValue('stockIsdnOrgPermissionDTOS', [
            ...oldValue,
            ...newValue,
          ]);
        }}
      />
    </>
  );
};

export default CTableSelectedUser;
