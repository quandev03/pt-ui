import { Col, Form, Row, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useAddUser, useGetDetailUser, useUpdateUser } from '../hooks';
// import { DataPayloadCreateUpdateUserUnit } from '../types';
import { FocusEvent, useRef } from 'react';

import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  CInput,
  cleanUpPhoneNumber,
  cleanUpString,
  CSelect,
  CSwitch,
  emailRegex,
  handlePasteRemoveSpace,
  IModeAction,
  ModalConfirm,
  passwordRegex,
  setFieldError,
  TitleHeader,
  useActionMode,
  usePermissions,
  validateForm,
} from '@vissoft-react/common';
import { pathRoutes } from 'apps/Internal/src/routers';
import useConfigAppStore from '../../Layouts/stores';
import { DataPayloadCreateUpdateUserPartnerCatalog } from '../types';
import {
  useCreateOrganizationUserByClientIdentity,
  useGetAllPartnerRoles,
  useGetOrganizationUserDetail,
  useUpdatePartnerUser,
} from '../hook';

export const ActionUserPartnerCatalog = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const { orgCode, id } = useParams<{ orgCode: string; id: string }>();

  const { data: listRoles, isLoading } = useGetAllPartnerRoles();

  const { data: userDetail } = useGetOrganizationUserDetail(
    orgCode ?? '',
    id ?? ''
  );

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const actionMode = useActionMode();
  const { menuData } = useConfigAppStore();
  const permissions = usePermissions(menuData);
  useEffect(() => {
    if (userDetail) {
      form.setFieldsValue({
        ...userDetail,
        roleIds: userDetail.roles?.map((role: any) => role.id),
      });
    }
  }, [userDetail, form]);

  const handleClose = () => {
    navigate(-1);
  };

  const { mutate: updateUser, isPending: loadingUpdate } = useUpdatePartnerUser(
    () => {
      navigate(-1);
    },
    (errors) => {
      setFieldError(form, errors);
    }
  );

  const { mutate: createUser, isPending: loadingAdd } =
    useCreateOrganizationUserByClientIdentity(
      () => {
        if (isSubmitBack) {
          handleClose();
        } else {
          form.resetFields();
          form.setFieldValue('status', 1);
        }
      },
      (errors) => {
        setFieldError(form, errors);
      }
    );

  const handleFinish = useCallback(
    (values: DataPayloadCreateUpdateUserPartnerCatalog) => {
      if (actionMode === IModeAction.CREATE) {
        createUser({
          payload: values,
          clientIdentity: orgCode ?? '',
        });
      } else if (actionMode === IModeAction.UPDATE) {
        ModalConfirm({
          title: 'Xác nhận',
          message: 'Bạn có chắc chắn muốn cập nhật không?',
          handleConfirm: () => {
            updateUser({
              payload: { ...values, status: values?.status ? 1 : 0 },
              id: id ?? '',
              clientIdentity: orgCode ?? '',
            });
          },
        });
      }
    },
    [actionMode, orgCode]
  );

  const renderTitle = useMemo(() => {
    switch (actionMode) {
      case IModeAction.CREATE:
        return 'Thêm mới user';
      case IModeAction.UPDATE:
        return 'Chỉnh sửa user';
      case IModeAction.READ:
        return 'Xem chi tiết user';
      default:
        return '';
    }
  }, [actionMode]);

  const capitalizeWords = useCallback((str: string) => {
    return str
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  const handleBlur = (e: FocusEvent<HTMLInputElement>, field: string) => {
    form.setFieldValue(field, e.target.value.trim());
    form.validateFields([field]);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{renderTitle}</TitleHeader>
      <Spin spinning={loadingAdd || loadingUpdate}>
        <Form
          form={form}
          onFinish={handleFinish}
          labelCol={{ span: 5 }}
          labelWrap={true}
          validateTrigger={['onSubmit']}
          colon={false}
          initialValues={{
            status: 1,
          }}
        >
          <div className="rounded-[10px] bg-white px-6 pt-4 pb-8">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Hoạt động"
                  name="status"
                  valuePropName="checked"
                >
                  <CSwitch disabled={IModeAction.UPDATE !== actionMode} />
                </Form.Item>
              </Col>
              <Col></Col>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullname"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || !value.trim()) {
                          return Promise.reject(
                            'Không được bỏ trống trường này'
                          );
                        }

                        const trimmed = value.trim();

                        const onlyLetters = /^[A-Za-zÀ-ỹ\s]+$/u;
                        if (!onlyLetters.test(trimmed)) {
                          return Promise.reject(
                            'Họ và tên không đúng định dạng'
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập họ và tên"
                    maxLength={50}
                    disabled={actionMode === IModeAction.READ}
                    onChange={(e) => {
                      const input = e.target.value;
                      const capitalized = capitalizeWords(input);
                      form.setFieldValue('fullname', capitalized);
                    }}
                    onBlur={(e) => {
                      const value = cleanUpString(e.target.value);

                      const formatted = value
                        .split(/\s+/)
                        .map((word) =>
                          word
                            ? word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                            : ''
                        )
                        .join(' ');

                      form.setFieldValue('fullname', formatted);
                    }}
                    preventNumber
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={'Email'}
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
                    onBlur={(e) => {
                      handleBlur(e, 'email');
                    }}
                    onPaste={(event) => handlePasteRemoveSpace(event, 100)}
                    maxLength={100}
                    disabled={actionMode === IModeAction.READ}
                    onInput={(e: any) =>
                      (e.target.value = cleanUpPhoneNumber(e.target.value))
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Username"
                  name="username"
                  required
                  rules={[validateForm.required]}
                >
                  <CInput
                    placeholder="Nhập username"
                    maxLength={50}
                    disabled={actionMode !== IModeAction.CREATE}
                    preventVietnamese
                    preventSpecialExceptHyphenAndUnderscore
                    onBlur={(e) => {
                      const value = cleanUpString(e.target.value);
                      form.setFieldValue('username', value);
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Vai trò"
                  name="roleIds"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    mode="multiple"
                    options={listRoles
                      ?.filter((role) => role?.status !== 0)
                      .map((role) => ({
                        value: role?.id,
                        label: role?.name,
                      }))}
                    placeholder="Chọn vai trò"
                    disabled={actionMode === IModeAction.READ}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  required
                  rules={[validateForm.required, {}]}
                >
                  <CInput
                    placeholder="Nhập số điện thoại"
                    maxLength={10}
                    disabled={actionMode !== IModeAction.CREATE}
                    onlyNumber
                    onBlur={(e) => {
                      const value = cleanUpPhoneNumber(e.target.value);
                      form.setFieldValue('phoneNumber', value);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="flex flex-wrap justify-end gap-4 mt-7">
            {actionMode === IModeAction.CREATE && (
              <CButtonSaveAndAdd
                onClick={() => {
                  form.submit();
                }}
                loading={false}
                disabled={false}
              />
            )}
            {actionMode !== IModeAction.READ &&
              (permissions.canUpdate || permissions.canCreate) && (
                <CButtonSave
                  onClick={() => {
                    setIsSubmitBack(true);
                    form.submit();
                  }}
                  loading={false}
                  disabled={false}
                />
              )}
            {actionMode === IModeAction.READ && permissions.canUpdate && (
              <CButtonEdit
                onClick={() => {
                  navigate(
                    pathRoutes.partnerCatalogUserEdit(
                      orgCode ?? '',
                      userDetail?.id
                    )
                  );
                }}
              />
            )}
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
};
