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
import Show from '@react/commons/Template/Show';
import { TitleHeader } from '@react/commons/Template/style';
import {
  ACTION_MODE_ENUM,
  IFieldErrorsItem,
  ModelStatus,
} from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { emailRegex } from '@react/constants/regex';
import {
  cleanUpPhoneNumber,
  handlePasteRemoveSpace,
  handlePasteRemoveTextKeepNumber,
} from '@react/helpers/utils';
import useActionMode from '@react/hooks/useActionMode';
import { Col, Form, Radio, Row, Spin } from 'antd';
import { useGetAllRole } from 'apps/Internal/src/components/layouts/queryHooks';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { phoneRegex } from 'apps/Internal/src/constants/regex';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { cleanUpString } from 'apps/Internal/src/helpers';
import { useListOrgUnit } from 'apps/Internal/src/hooks/useListOrgUnit';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IRoleItem } from '../../RoleManagement/types';
import {
  useCheckAllowDelete,
  useGetAllGroupUser,
  useGetDepartments,
  useSupportAddUser,
  useSupportDeleteUser,
  useSupportGetUser,
  useSupportUpdateUser,
} from '../queryHooks';
import { IFormUser, IGroups } from '../types';

const ActionUser = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const navigate = useNavigate();
  const pathname = useLocation();
  const [form] = Form.useForm();
  const loginMethod = Form.useWatch('loginMethod', form);
  const { id } = useParams();
  const { data: INTERNAL_DEPARTMENT = [] } = useGetDepartments();
  const actionByRole = useRolesByRouter();
  const [roleInActive, setRoleInActive] = useState<IRoleItem[]>([]);
  const [groupsInActive, setGroupsInActive] = useState<IGroups[]>([]);
  const actionMode = useActionMode();
  const {
    mutate: getUserAction,
    isPending: loadingGetUser,
    data: userDetail,
  } = useSupportGetUser((user) => {
    form.setFieldsValue({
      ...user,
      roleIds: user.roles.map((item) => item.id),
      groupIds: user.groups.map((item) => item.id),
      departmentIds:
        user.departments && user.departments.length > 0
          ? user.departments[0].id
          : null,
      status:
        user?.status === ModelStatus.ACTIVE
          ? ModelStatus.ACTIVE
          : ModelStatus.INACTIVE,
    });
    setRoleInActive(user.roles.filter((item) => !item.status));
    setGroupsInActive(user.groups.filter((item) => !item.status));
  });

  const { data: groupUser } = useGetAllGroupUser();

  const optionGroups = useMemo(() => {
    if (!groupUser) return [];
    const options = groupUser
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
      groupsInActive.forEach((item) => {
        options.unshift({
          label: `${item.name} (Ngưng hoạt động)`,
          value: item.id,
        });
      });
    }
    groupsInActive.forEach((item) => {
      if (!item.status) {
        options.unshift({
          label: `${item.name} (Ngưng hoạt động)`,
          value: item.id,
        });
      }
    });
    return options;
  }, [groupUser, actionMode, groupsInActive]);

  useEffect(() => {
    if (id) {
      getUserAction(id);
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
  }, [listRole, actionMode, roleInActive]);

  const { data: listOrganization } = useListOrgUnit({ status: 1 });
  const optionOrganization = useMemo(() => {
    if (!listOrganization) {
      return [];
    }
    return listOrganization;
  }, [listOrganization]);

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
        return 'Xem chi tiết tài khoản nhân sự';
      case ACTION_MODE_ENUM.CREATE:
        return 'Tạo tài khoản nhân sự';
      case ACTION_MODE_ENUM.EDIT:
        return 'Chỉnh sửa tài khoản nhân sự';
      default:
        return 'Tạo tài khoản nhân sự';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: IFormUser) => {
      const data: IFormUser = {
        ...values,
        id: actionMode === ACTION_MODE_ENUM.EDIT ? id : undefined,
        status: values?.status ? 1 : 0,
        fullname: cleanUpString(values.fullname),
        username: cleanUpString(values.username),
        phoneNumber: values.phoneNumber
          ? cleanUpPhoneNumber(values.phoneNumber)
          : undefined,
        roleIds: values.roleIds,
        groupIds: values.groupIds ?? [],
        departmentIds: (values.departmentIds as string)
          ? ([values.departmentIds] as string[])
          : [],
      };
      if (actionMode === ACTION_MODE_ENUM.CREATE) {
        createUser(data);
      } else if (actionMode === ACTION_MODE_ENUM.EDIT) {
        ModalConfirm({
          title: 'Xác nhận',
          message: 'Bạn có chắc chắn muốn cập nhật không?',
          handleConfirm: () => {
            updateUser(data);
          },
        });
      }
    },
    [actionMode, id]
  );

  const handleClose = useCallback(() => {
    navigate(-1);
  }, []);

  const { mutate: deleteUser, isPending: loadingDelete } = useSupportDeleteUser(
    () => {
      navigate(pathRoutes.userManager);
    }
  );
  const { mutate: checkAllowDelete } = useCheckAllowDelete((id) => {
    deleteUser(id);
  });

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetUser}>
        <Form
          form={form}
          onFinish={handleFinish}
          labelCol={{ span: 5 }}
          labelWrap={true}
          validateTrigger={['onSubmit']}
          colon={false}
          initialValues={{
            status: 1,
            loginMethod: '2',
          }}
          onValuesChange={(changedValues, allValues) => {
            if (
              changedValues.loginMethod &&
              changedValues.loginMethod === '2' &&
              allValues.email
            ) {
              form.setFieldsValue({ username: allValues.email });
            } else if (
              changedValues.loginMethod &&
              changedValues.loginMethod === '1' &&
              userDetail
            ) {
              form.setFieldsValue({ username: userDetail.username });
            }
          }}
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Kiểu đăng nhập"
                  name="loginMethod"
                  required={true}
                >
                  <Radio.Group
                    disabled={ACTION_MODE_ENUM.CREATE !== actionMode}
                  >
                    <Radio value="1"> Username </Radio>
                    <Radio value="2"> Google và Username </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Hoạt động"
                  name="status"
                  valuePropName="checked"
                >
                  <CSwitch disabled={ACTION_MODE_ENUM.EDIT !== actionMode} />
                </Form.Item>
              </Col>
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
                    onBlur={(e) => {
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
                    onPaste={(event) => {
                      if (actionMode === ACTION_MODE_ENUM.CREATE) {
                        handlePasteRemoveSpace(event, 100);
                      }
                    }}
                    onBlur={(e) => {
                      const value = cleanUpPhoneNumber(e.target.value);
                      form.setFieldValue('email', value);
                      form.validateFields(['email']);
                      if (loginMethod === '2') {
                        form.setFieldValue('username', value);
                      }
                    }}
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
                        if (loginMethod === '1') {
                          if (emailRegex.test(value)) {
                            return Promise.resolve();
                          } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
                            return Promise.reject(
                              'Username không đúng định dạng'
                            );
                          } else {
                            return Promise.resolve();
                          }
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập Username"
                    maxLength={loginMethod === '1' ? 50 : 100}
                    disabled={
                      actionMode !== ACTION_MODE_ENUM.CREATE ||
                      loginMethod === '2'
                    }
                    preventSpace
                    onInput={(e: any) => {
                      e.target.value = cleanUpPhoneNumber(e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="SĐT"
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
                    placeholder="Nhập SĐT"
                    disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                    onlyNumber
                    onPaste={(event) =>
                      handlePasteRemoveTextKeepNumber(event, 10)
                    }
                    onInput={(e: any) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ''))
                    }
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
                    maxRow={3}
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
                <Form.Item label="Nhóm tài khoản" name="groupIds">
                  <CSelect
                    placeholder="Chọn nhóm tài khoản"
                    options={optionGroups}
                    mode="multiple"
                    maxRow={3}
                    disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                    onChange={(value: string[]) => {
                      const newGroupInActive = groupsInActive.filter((item) =>
                        value.includes(item.id)
                      );
                      setGroupsInActive(newGroupInActive);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Chức vụ" name="positionTitle">
                  <CInput
                    maxLength={100}
                    placeholder="Nhập chức vụ"
                    disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phòng ban" name="departmentIds">
                  <CSelect
                    placeholder="Chọn phòng ban"
                    options={INTERNAL_DEPARTMENT}
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
                <Show>
                  <Show.When
                    isTrue={includes(actionByRole, ActionsTypeEnum.DELETE)}
                  >
                    <CButtonDelete
                      onClick={() => {
                        ModalConfirm({
                          title: 'Bạn có chắc chắn muốn Xóa bản ghi không?',
                          message: 'Các dữ liệu liên quan cũng sẽ bị xóa',
                          handleConfirm: () => {
                            checkAllowDelete(id!);
                          },
                        });
                      }}
                      loading={loadingDelete}
                      disabled={loadingDelete}
                    />
                  </Show.When>
                </Show>
                <Show>
                  <Show.When
                    isTrue={includes(actionByRole, ActionsTypeEnum.UPDATE)}
                  >
                    <CButtonEdit
                      onClick={() => {
                        navigate(pathRoutes.userManagerEdit(id));
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

export default ActionUser;
