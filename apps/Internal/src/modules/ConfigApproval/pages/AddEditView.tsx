import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CModalConfirm,
  CSwitch,
  FormFooterDetail,
  NotificationError,
} from '@react/commons/index';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { getActionMode } from '@react/utils/index';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { useQueryClient } from '@tanstack/react-query';
import { Card, Col, Flex, Form, FormListOperation, Row, Spin } from 'antd';
import Column from 'antd/lib/table/Column';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useGetAllUser } from 'apps/Internal/src/hooks/useGetAllUser';
import { useListOrgUnit } from 'apps/Internal/src/hooks/useListOrgUnit';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateConfig } from '../hooks/useCreateConfig';
import { useDeleteConfig } from '../hooks/useDeleteConfig';
import {
  queryKeyDetailConfig,
  useDetailConfig,
} from '../hooks/useDetailConfig';
import { useEditConfig } from '../hooks/useEditConfig';
import { UserInfoType } from '../hooks/useUsersByOrgId';
import { AddEditViewProps } from '../types';
import formInstance from '@react/utils/form';

const AddEditViewPage: React.FC<AddEditViewProps> = ({ actionMode }) => {
  const [form] = Form.useForm();
  const dataTable: any[] = Form.useWatch('processSteps', form);
  const isViewMode = actionMode === ACTION_MODE_ENUM.VIEW;
  const isCreateMode = actionMode === ACTION_MODE_ENUM.CREATE;
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const { mutate: mutateCreate, isPending: isLoadingCreate } =
    useCreateConfig();
  const { data, isFetching: isLoadingDetail } = useDetailConfig(id);
  const { data: listUser = [], isFetching: isLoadingUser } = useGetAllUser();
  const { mutate: mutateEdit, isPending: isLoadingEdit } = useEditConfig();
  const { mutate: mutateDelete, isPending: isLoadingDelete } =
    useDeleteConfig();
  const { data: listOrgUnit, isFetching: isLoadingOrgUnit } = useListOrgUnit({
    status: 1,
  });
  const { isLoading: isLoadingProcess, data: listProcess } = useParameterQuery({
    'table-name': 'APPROVAL_PROCESS',
    'column-name': 'PROCESS_CODE',
  });

  useEffect(() => {
    setUserOptions(
      listUser.map((e) => ({
        value: e.id,
        label: e.username,
        userFullName: e.fullname,
      }))
    );
  }, [listUser]);

  const listCurrentUser = (value: string) => {
    const selectedUserId = dataTable
      ?.map((e) => e.userId)
      ?.filter((c) => c !== value);
    return userOptions.filter((d) => !selectedUserId.includes(d.value));
  };

  useEffect(() => {
    form.setFieldValue('processSteps', [{}]);
    if (data) {
      let { processSteps, ...restData } = data;
      processSteps = processSteps?.map((e) => ({
        ...e,
        userFullName: userOptions.find((c) => c.value === e.userId)
          ?.userFullName,
      }));
      form.setFieldsValue({ processSteps, ...restData });
    }
  }, [data, userOptions, isViewMode]);

  const handleSubmit = (values: any, isSaveAndAdd?: boolean) => {
    const { processCode, status = true, orgId } = values;
    if (!dataTable.length) {
      NotificationError('User không được để trống');
      return;
    }
    const processName = listProcess?.find(
      (e) => e.value === processCode
    )?.label;
    const orgName = listOrgUnit?.find((e) => e.value === orgId)?.label;
    const processSteps = dataTable.map(({ userId, ...e }, idx) => {
      const userName = userOptions.find((c) => c.value === userId)?.label;
      return {
        id: e.id,
        stepOrder: ++idx,
        userId,
        userName,
      };
    });
    const payload = {
      status,
      processName,
      processCode,
      orgName,
      orgId,
      processSteps,
    };
    switch (actionMode) {
      case ACTION_MODE_ENUM.VIEW:
        navigate(pathRoutes.config_approval_edit(id));
        break;
      case ACTION_MODE_ENUM.CREATE:
        mutateCreate(payload, {
          onSuccess: () =>
            !isSaveAndAdd ? window.history.back() : form.resetFields(),
          onError: ({ errors = [] }: any) => {
            formInstance.getFormError(form, errors);
          },
        });
        break;
      case ACTION_MODE_ENUM.EDIT:
        CModalConfirm({
          message: MESSAGE.G04,
          onOk: () => {
            id &&
              mutateEdit(
                { id, payload },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: [queryKeyDetailConfig, id],
                    });
                  },
                }
              );
          },
        });
        break;
    }
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };

  const handleAddItem = (add: FormListOperation['add']) => {
    const record = {};
    add(record);
  };
  const handleRemoveItem = (
    remove: FormListOperation['remove'],
    index: number
  ) => {
    remove(index);
  };

  const handleSelectUser = (_: string, option: UserInfoType, idx: number) => {
    form.setFieldValue(
      ['processSteps', idx, 'userFullName'],
      option.userFullName
    );
  };

  const handleDelete = () => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => id && mutateDelete(id, { onSuccess: () => navigate(-1) }),
    });
  };
  const handleEdit = () => {
    navigate(pathRoutes.config_approval_edit(id));
  };
  return (
    <>
      <TitleHeader>{`${getActionMode(
        actionMode
      )} cấu hình phê duyệt`}</TitleHeader>
      <Spin
        spinning={
          isLoadingCreate || isLoadingDetail || isLoadingEdit || isLoadingDelete
        }
      >
        <Form form={form} colon={false} onFinish={handleFinish}>
          <Card className="mb-5">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Quy trình"
                  name="processCode"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    options={listProcess}
                    placeholder="Chọn quy trình"
                    disabled={!isCreateMode}
                    isLoading={isLoadingProcess}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên kho"
                  name="orgId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Chọn tên kho"
                    disabled={!isCreateMode}
                    options={listOrgUnit}
                    isLoading={isLoadingOrgUnit}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.List name={'processSteps'}>
                  {(_, { add, remove }) => (
                    <div className="mb-4">
                      <Flex justify="end" align="end" gap={12}>
                        <CTable
                          rowKey={'id'}
                          dataSource={dataTable}
                          loading={false}
                          scroll={undefined}
                          pagination={false}
                          className="dynamic-table"
                        >
                          <Column
                            width={50}
                            dataIndex="stt"
                            title={'STT'}
                            render={(_, __, index) => ++index}
                          />
                          <Column
                            width={155}
                            dataIndex="userId"
                            title={
                              <div className="label-required-suffix">User</div>
                            }
                            align="left"
                            render={(value, record: any, index) => (
                              <span title={value}>
                                {record?.check ? (
                                  value
                                ) : (
                                  <Form.Item
                                    name={[index, 'userId']}
                                    rules={[validateForm.required]}
                                  >
                                    <CSelect
                                      placeholder="Chọn user"
                                      options={listCurrentUser(value)}
                                      disabled={isViewMode}
                                      isLoading={isLoadingUser}
                                      onSelect={(value, option) =>
                                        handleSelectUser(
                                          value,
                                          option as UserInfoType,
                                          index
                                        )
                                      }
                                    />
                                  </Form.Item>
                                )}
                              </span>
                            )}
                          />
                          <Column
                            dataIndex="userFullName"
                            title="Họ và tên"
                            width={175}
                            render={(value, record: any, index: number) => (
                              <Form.Item name={[index, 'userFullName']}>
                                <div>{value}</div>
                              </Form.Item>
                            )}
                          />
                          <Column
                            dataIndex="id"
                            title=""
                            align="center"
                            width={75}
                            hidden={isViewMode}
                            render={(_, record: any, index: number) => (
                              <Flex justify="end" gap={12}>
                                {dataTable.length > 1 && (
                                  <FontAwesomeIcon
                                    icon={faMinus}
                                    onClick={() =>
                                      handleRemoveItem(remove, index)
                                    }
                                    className="mr-2 cursor-pointer"
                                    size="lg"
                                    title="Xóa"
                                  />
                                )}
                              </Flex>
                            )}
                          />
                        </CTable>
                        {!isViewMode && (
                          <FontAwesomeIcon
                            icon={faPlus}
                            onClick={() => handleAddItem(add)}
                            size="lg"
                            className="cursor-pointer mb-[18px]"
                            title="Thêm"
                          />
                        )}
                      </Flex>
                    </div>
                  )}
                </Form.List>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Hoạt động"
                  name="status"
                  valuePropName="checked"
                >
                  <CSwitch defaultChecked disabled={true} />
                </Form.Item>
              </Col>
            </Row>
            <FormFooterDetail
              actionMode={actionMode}
              handleDelete={handleDelete}
              onSubmit={handleSubmit}
              handleEdit={handleEdit}
            />
          </Card>
        </Form>
      </Spin>
    </>
  );
};

export default AddEditViewPage;
