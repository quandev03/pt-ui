import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CSwitch from '@react/commons/Switch';
import { TitleHeader } from '@react/commons/Template/style';
import {
  ACTION_MODE_ENUM,
  IFieldErrorsItem,
  ModelStatus,
} from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { emailRegex, phoneRegex } from '@react/constants/regex';
import {
  cleanUpPhoneNumber,
  handlePasteRemoveSpace,
} from '@react/helpers/utils';
import useActionMode from '@react/hooks/useActionMode';
import { Col, Form, Row, Spin } from 'antd';
import { useGetAllRole } from 'apps/Internal/src/components/layouts/queryHooks';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { cleanUpString } from 'apps/Internal/src/helpers';
import { useGetAllOrganizationPartner } from 'apps/Internal/src/hooks/useGetAllOrganizationPartner';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IRoleItem } from '../../RoleManagement/types';
import {
  useSupportAddUser,
  useSupportDeleteUser,
  useSupportGetUser,
  useSupportUpdateUser,
} from '../queryHooks';
import { IFormUser } from '../types';

const ActionUser = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { orgCode, id } = useParams();
  const actionByRole = useRolesByRouter();
  const { pathname } = useLocation();

  const { data: listOrganization } = useGetAllOrganizationPartner(
    orgCode as string
  );

  useEffect(() => {
    if (listOrganization && listOrganization.length > 0) {
      const rootOrganization = listOrganization.find(
        (item) => item.parentId === null
      );
      if (rootOrganization) {
        form.setFieldsValue({
          organizationIds: [rootOrganization.value],
        });
      }
    }
  }, [listOrganization]);

  const optionOrganization = useMemo(() => {
    if (!listOrganization) {
      return [];
    }
    return listOrganization;
  }, [listOrganization]);

  const [roleInActive, setRoleInActive] = useState<IRoleItem[]>([]);
  const {
    mutate: getUserAction,
    isPending: loadingGetUser,
    data: userDetail,
  } = useSupportGetUser((user) => {
    form.setFieldsValue({
      ...user,
      status: user?.status === 1 ? 1 : 0,
    });
    setRoleInActive(user.roles.filter((item) => !item.status));
  });
  const actionMode = useActionMode();

  useEffect(() => {
    if (id) {
      getUserAction({
        clientIdentity: orgCode as string,
        id: id,
      });
    } else {
      form.setFieldsValue({ status: true });
    }
  }, [pathname]);

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

  const { data: listRole } = useGetAllRole({ isPartner: true });
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
    if (actionMode === ACTION_MODE_ENUM.CREATE) {
      return options;
    }
    if (actionMode === ACTION_MODE_ENUM.EDIT) {
      roleInActive.forEach((item) => {
        options.unshift({
          label: `${item.name} (Ngưng hoạt động)`,
          value: item.id,
        });
      });
    }
    roleInActive.forEach((item) => {
      if (!item.status) {
        options.unshift({
          label: `${item.name} (Ngưng hoạt động)`,
          value: item.id,
        });
      }
    });
    return options;
  }, [listRole, actionMode, roleInActive, form]);

  const { mutate: createUser, isPending: loadingAdd } = useSupportAddUser(
    () => {
      if (isSubmitBack) {
        handleClose();
      } else {
        form.resetFields();
        form.setFieldValue('status', 1);
      }
    },
    setFieldError
  );
  const { mutate: updateUser, isPending: loadingUpdate } = useSupportUpdateUser(
    () => {
      navigate(-1);
    },
    setFieldError
  );

  const Title = useMemo(() => {
    switch (actionMode) {
      case ACTION_MODE_ENUM.VIEW:
        return 'Xem chi tiết user';
      case ACTION_MODE_ENUM.CREATE:
        return 'Tạo user';
      case ACTION_MODE_ENUM.EDIT:
        return 'Chỉnh sửa user';
      default:
        return 'Tạo user';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: IFormUser) => {
      const data: IFormUser = {
        ...values,
        status: values?.status ? ModelStatus.ACTIVE : ModelStatus.INACTIVE,
        fullname: cleanUpString(values.fullname),
        username: cleanUpString(values.username),
        roleIds: values.roleIds,
        groupIds: values.groupIds ?? [],
      };
      if (actionMode === ACTION_MODE_ENUM.CREATE) {
        createUser({
          clientIdentity: orgCode as string,
          user: data,
        });
      } else if (actionMode === ACTION_MODE_ENUM.EDIT) {
        ModalConfirm({
          title: 'Xác nhận',
          message: 'Bạn có chắc chắn muốn cập nhật không?',
          handleConfirm: () => {
            updateUser({
              clientIdentity: orgCode as string,
              id: id,
              user: data,
            });
          },
        });
      }
    },
    [actionMode, id, orgCode]
  );

  const handleClose = useCallback(() => {
    navigate(-1);
  }, []);

  const { mutate: deleteUser, isPending: loadingDelete } = useSupportDeleteUser(
    () => {
      navigate(pathRoutes.partnerCatalogUserManagement(orgCode), {
        replace: true,
      });
    }
  );
  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetUser}>
        <Form
          form={form}
          onFinish={handleFinish}
          labelCol={{ span: 6 }}
          validateTrigger={['onSubmit']}
          colon={false}
          initialValues={{
            status: 1,
          }}
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Hoạt động"
                  name="status"
                  valuePropName="checked"
                >
                  <CSwitch disabled={ACTION_MODE_ENUM.EDIT !== actionMode} />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullname"
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
                    placeholder="Nhập họ và tên"
                    maxLength={100}
                    disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                    onBlur={(e: any) => {
                      const value = cleanUpString(e.target.value);
                      form.setFieldValue('fullname', value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else if (!emailRegex.test(value)) {
                          return Promise.reject('Email không đúng định dạng');
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập email"
                    maxLength={100}
                    disabled={actionMode !== ACTION_MODE_ENUM.CREATE}
                    preventSpace
                    onPaste={(event) => handlePasteRemoveSpace(event, 100)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Username"
                  name="username"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        }
                        if (emailRegex.test(value)) {
                          return Promise.resolve();
                        } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
                          return Promise.reject(
                            'Username không đúng định dạng'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập Username"
                    maxLength={50}
                    disabled={actionMode !== ACTION_MODE_ENUM.CREATE}
                    preventSpace
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
                    mode="multiple"
                    disabled={actionMode === ACTION_MODE_ENUM.VIEW}
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
                <Form.Item label="Kho" name="organizationIds">
                  <CSelect
                    placeholder="Chọn kho"
                    options={optionOrganization}
                    mode="multiple"
                    maxRow={3}
                    disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || !cleanUpPhoneNumber(value)) {
                          return Promise.resolve();
                        } else if (!phoneRegex.test(value)) {
                          return Promise.reject('SĐT không đúng định dạng');
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CInput
                    maxLength={10}
                    placeholder="Nhập số điện thoại"
                    onlyNumber
                    disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="flex gap-4 flex-wrap justify-end mt-7">
            {actionMode === ACTION_MODE_ENUM.CREATE && (
              <CButtonSaveAndAdd
                onClick={() => {
                  form.submit();
                }}
                loading={loadingAdd || loadingUpdate}
                disabled={loadingAdd || loadingUpdate}
              />
            )}
            {actionMode !== ACTION_MODE_ENUM.VIEW &&
              (includes(actionByRole, ActionsTypeEnum.UPDATE) ||
                includes(actionByRole, ActionsTypeEnum.CREATE)) && (
                <CButtonSave
                  onClick={() => {
                    setIsSubmitBack(true);
                    form.submit();
                  }}
                  loading={loadingAdd || loadingUpdate}
                  disabled={loadingAdd || loadingUpdate}
                />
              )}
            {actionMode === ACTION_MODE_ENUM.VIEW && (
              <>
                {userDetail && userDetail?.status === ModelStatus.INACTIVE && (
                  <CButtonDelete
                    onClick={() => {
                      ModalConfirm({
                        title: 'Bạn có chắc chắn muốn Xóa bản ghi không?',
                        message: 'Các dữ liệu liên quan cũng sẽ bị xóa',
                        handleConfirm: () => {
                          deleteUser({
                            clientIdentity: orgCode as string,
                            id: id!,
                          });
                        },
                      });
                    }}
                    loading={loadingDelete}
                    disabled={loadingDelete}
                  >
                    Xóa
                  </CButtonDelete>
                )}
                <CButtonEdit
                  onClick={() => {
                    navigate(pathRoutes.partnerCatalogUserEdit(orgCode, id));
                  }}
                >
                  Chỉnh sửa
                </CButtonEdit>
              </>
            )}
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
};
export default ActionUser;
