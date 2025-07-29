import {
  CButtonClose,
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
} from '@react/helpers/utils';
import useActionMode from '@react/hooks/useActionMode';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { Col, Form, Row, Spin } from 'antd';
import { useGetAllRole } from 'apps/Partner/src/components/layouts/queryHooks';
import useConfigAppNoPersistStore from 'apps/Partner/src/components/layouts/store/useConfigAppNoPersistStore';
import { IUserInfo } from 'apps/Partner/src/components/layouts/types';
import ModalConfirm from 'apps/Partner/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { cleanUpString } from 'apps/Partner/src/helpers';
import { useGetAllOrganizationPartner } from 'apps/Partner/src/hooks/useGetAllOrganizationPartner';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import validateForm from 'apps/Partner/src/utils/validator';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSupportGetUser, useSupportUpdateUser } from '../queryHooks';
import { IFormUser, IRoleItem } from '../types';

const ActionUser = () => {
  const { setBreadcrumbsParams } = useConfigAppNoPersistStore();
  const userLogin = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  const [, setIsSubmitBack] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const actionByRole = useRolesByRouter();
  const [roleInActive, setRoleInActive] = useState<IRoleItem[]>([]);
  const { mutate: getUserAction, isPending: loadingGetUser } =
    useSupportGetUser((user) => {
      setBreadcrumbsParams({ id: user.fullname ?? '' });
      form.setFieldsValue({
        ...user,
        status:
          user?.status === ModelStatus.ACTIVE
            ? ModelStatus.ACTIVE
            : ModelStatus.INACTIVE,
      });
      setRoleInActive(user.roles.filter((item) => !item.status));
    });

  const actionMode = useActionMode();

  useEffect(() => {
    if (id) {
      getUserAction(id);
    } else {
      form.setFieldsValue({ status: true });
    }
  }, [form, getUserAction, id]);

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

  const { data: listRole } = useGetAllRole();
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

  const { data: listOrganization } = useGetAllOrganizationPartner(id as string);
  const optionOrganization = useMemo(() => {
    if (!listOrganization) {
      return [];
    }
    return listOrganization;
  }, [listOrganization]);

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
      case ACTION_MODE_ENUM.EDIT:
        return 'Chỉnh sửa tài khoản nhân sự';
      default:
        return 'Xem chi tiết tài khoản nhân sự';
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
        clientId: userLogin ? userLogin?.client?.id : '',
      };
      if (actionMode === ACTION_MODE_ENUM.EDIT) {
        ModalConfirm({
          title: 'Xác nhận',
          message: 'Bạn có chắc chắn muốn cập nhật không?',
          handleConfirm: () => {
            updateUser(data);
          },
        });
      }
    },
    [actionMode, id, updateUser, userLogin]
  );

  const handleClose = useCallback(() => {
    navigate(-1);
  }, []);

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
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Hoạt động"
                  name="status"
                  valuePropName="checked"
                >
                  <CSwitch disabled />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullname"
                  rules={[validateForm.required]}
                >
                  <CInput
                    placeholder="Nhập họ và tên"
                    maxLength={100}
                    disabled
                    onBlur={(e) => {
                      const value = form.getFieldValue('fullname');
                      form.setFieldValue('fullname', cleanUpString(value));
                      form.validateFields(['fullname']);
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
                    disabled
                    onInput={(e: any) =>
                      (e.target.value = cleanUpPhoneNumber(e.target.value))
                    }
                    onPaste={(event) => handlePasteRemoveSpace(event, 100)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[validateForm.required]}
                >
                  <CInput
                    placeholder="Nhập email"
                    maxLength={100}
                    disabled
                    onInput={(e: any) =>
                      (e.target.value = cleanUpPhoneNumber(e.target.value))
                    }
                    onPaste={(event) => handlePasteRemoveSpace(event, 100)}
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
                    disabled
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
                loading={loadingUpdate}
                disabled={loadingUpdate}
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
                  loading={loadingUpdate}
                  disabled={loadingUpdate}
                />
              )}
            {actionMode === ACTION_MODE_ENUM.VIEW && (
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
            )}
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
};
export default ActionUser;
