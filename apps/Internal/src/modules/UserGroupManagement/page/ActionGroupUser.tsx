import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { includes } from 'lodash';
import {
  useSupportAddGroup,
  useSupportDeleteGroup,
  useSupportGetGroupUser,
  useSupportUpdateGroup,
} from '../queryHook';
import { Role, User } from '../types';
import { Col, Form, Row, Spin } from 'antd';
import {
  ActionsTypeEnum,
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CInput,
  CSelect,
  CSwitch,
  IFieldErrorsItem,
  IModeAction,
  ModalConfirm,
  Show,
  textOnlyRegex,
  TitleHeader,
  useActionMode,
  usePermissions,
} from '@vissoft-react/common';
import { useGetAllRole } from '../../UserManagement/hooks';
import { CButtonSaveAndAdd } from '@vissoft-react/common';
import { CButtonSave } from '@vissoft-react/common';
import { pathRoutes } from '../../../routers';
import { useGetAllUsers } from '../../../hooks';
import useConfigAppStore from '../../Layouts/stores';

export const ActionGroupUser = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const navigate = useNavigate();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const [form] = Form.useForm();
  const pathname = useLocation();
  const { id } = useParams();
  const [roleInActive, setRoleInActive] = useState<Role[]>([]);
  const [userInActive, setUserInActive] = useState<User[]>([]);

  const { mutate: getGroupUser, isPending: loadingGetUserGroup } =
    useSupportGetGroupUser((data) => {
      form.setFieldsValue({
        ...data,
        roleIds: data.roles.map((item) => item.id),
        userIds: data.users.map((user) => user.id),
      });
      setUserInActive(data.users.filter((item) => !item.status));
      setRoleInActive(data.roles.filter((item) => !item.status));
    });

  const actionMode = useActionMode();

  const handleClose = () => {
    navigate(-1);
  };

  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.detail],
        }))
      );
    },
    [form]
  );

  const { mutate: createGroup, isPending: loadingAdd } = useSupportAddGroup(
    () => {
      console.log(isSubmitBack);
      if (isSubmitBack) {
        handleClose();
      } else {
        form.resetFields();
        form.setFieldValue('status', 1);
      }
    },
    setFieldError
  );
  const { mutate: deleteGroup, isPending: loadingDelete } =
    useSupportDeleteGroup(handleClose);
  const { mutate: updateGroup, isPending: loadingUpdate } =
    useSupportUpdateGroup(handleClose, setFieldError);

  useEffect(() => {
    if (id) {
      getGroupUser(id);
    } else {
      form.setFieldsValue({ status: true });
    }
  }, [pathname]);

  const { data: listRole } = useGetAllRole({ isPartner: false });

  const optionListRole = useMemo(() => {
    if (!listRole) {
      return [];
    }
    const options = listRole
      .filter((item) => item.status)
      .map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    if (actionMode === IModeAction.CREATE) {
      return options;
    }
    if (actionMode === IModeAction.UPDATE || actionMode === IModeAction.READ) {
      roleInActive.forEach((item) => {
        options.unshift({
          label: `${item.name} (Ngưng hoạt động)`,
          value: item.id,
        });
      });
    }
    return options;
  }, [listRole, actionMode, roleInActive, form]);

  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết';
      case IModeAction.CREATE:
        return 'Tạo nhóm tài khoản nhân sự';
      case IModeAction.UPDATE:
        return 'Chỉnh sửa nhóm tài khoản nhân sự';
      default:
        return 'Tạo nhóm tài khoản nhân sự';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: any) => {
      const data = {
        id: id || undefined,
        ...values,
        status: values.status ? 1 : 0,
      };
      if (actionMode === IModeAction.CREATE) {
        console.log(isSubmitBack);
        createGroup(data);
      } else if (actionMode === IModeAction.UPDATE) {
        ModalConfirm({
          title: 'Xác nhận',
          message: 'Bạn có chắc chắn muốn cập nhật không?',
          handleConfirm: () => {
            updateGroup(data);
          },
        });
      }
    },
    [actionMode, isSubmitBack, id]
  );

  const { data: listUser } = useGetAllUsers({ isPartner: false });
  const optionsUser = useMemo(() => {
    if (!listUser) {
      return [];
    }
    const options = listUser
      .filter((item) => item.status)
      .map((item) => {
        return {
          value: item.id,
          label: item.username,
        };
      });
    if (actionMode === IModeAction.CREATE) {
      return options;
    }
    if (actionMode === IModeAction.UPDATE || actionMode === IModeAction.READ) {
      userInActive.forEach((item) => {
        options.unshift({
          label: `${item.username} (Ngưng hoạt động)`,
          value: item.id,
        });
      });
    }
    return options;
  }, [listUser, actionMode, userInActive]);

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetUserGroup}>
        <Form
          form={form}
          onFinish={handleFinish}
          labelCol={{ span: 4 }}
          validateTrigger={['onSubmit']}
          colon={false}
          initialValues={{
            status: 1,
          }}
          labelAlign="left"
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  valuePropName="checked"
                >
                  <CSwitch disabled={IModeAction.UPDATE !== actionMode} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Mã nhóm"
                  name="code"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else if (!textOnlyRegex.test(value)) {
                          return Promise.reject('Mã nhóm chưa đúng định dạng');
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập mã nhóm"
                    maxLength={100}
                    preventSpecial
                    uppercase
                    preventSpace
                    preventVietnamese
                    disabled={actionMode === IModeAction.READ}
                    onInput={(e: any) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên nhóm"
                  name="name"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập tên nhóm"
                    maxLength={100}
                    disabled={actionMode === IModeAction.READ}
                    onBlur={() => {
                      const value: string = form.getFieldValue('name') ?? '';
                      form.setFieldsValue({
                        name: value.trim(),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Vai trò"
                  name="roleIds"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || value.length === 0) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CSelect
                    placeholder="Chọn vai trò"
                    options={optionListRole}
                    maxRow={5}
                    mode="multiple"
                    disabled={actionMode === IModeAction.READ}
                    onChange={(value: string[]) => {
                      const newRoleInActive = roleInActive.filter((item) =>
                        value.includes(item.id)
                      );
                      setRoleInActive(newRoleInActive);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="User"
                  name="userIds"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || value.length === 0) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CSelect
                    placeholder="Chọn user"
                    mode="multiple"
                    maxRow={5}
                    options={optionsUser}
                    disabled={actionMode === IModeAction.READ}
                    onChange={(value: string[]) => {
                      const newUserInActive = userInActive.filter((item) =>
                        value.includes(item.id)
                      );
                      setUserInActive(newUserInActive);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="flex gap-4 flex-wrap justify-end mt-7">
            {actionMode === IModeAction.CREATE && (
              <CButtonSaveAndAdd
                onClick={() => {
                  form.submit();
                }}
                loading={loadingAdd || loadingUpdate}
                disabled={loadingAdd || loadingUpdate}
              />
            )}
            {actionMode !== IModeAction.READ &&
              (permission.canUpdate || permission.canCreate) && (
                <CButtonSave
                  onClick={() => {
                    setIsSubmitBack(true);
                    form.submit();
                  }}
                  loading={loadingAdd || loadingUpdate}
                  disabled={loadingAdd || loadingUpdate}
                />
              )}
            {actionMode === IModeAction.READ && (
              <>
                <Show>
                  <Show.When isTrue={permission.canDelete}>
                    <CButtonDelete
                      onClick={() => {
                        ModalConfirm({
                          title: 'Xác nhận',
                          message: 'Bạn có chắc chắn muốn xóa tài khoản này?',
                          handleConfirm: () => {
                            deleteGroup(id!);
                          },
                        });
                      }}
                      loading={loadingDelete}
                      disabled={loadingDelete}
                    />
                  </Show.When>
                </Show>
                <Show>
                  <Show.When isTrue={permission.canUpdate}>
                    <CButtonEdit
                      onClick={() => {
                        navigate(pathRoutes.groupUserManagerEdit(id));
                      }}
                    />
                  </Show.When>
                </Show>
              </>
            )}
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
};
