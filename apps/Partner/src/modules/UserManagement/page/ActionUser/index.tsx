import {
  AnyElement,
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  CInput,
  CSelect,
  CSwitch,
  IModeAction,
  MESSAGE,
  TitleHeader,
  cleanUpPhoneNumber,
  cleanUpString,
  emailRegex,
  handlePasteRemoveSpace,
  handlePasteRemoveTextKeepNumber,
  phoneRegex,
  usePermissions,
} from '@vissoft-react/common';
import { Col, Form, Row, Spin } from 'antd';
import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pathRoutes } from '../../../../../src/routers';
import useConfigAppStore from '../../../Layouts/stores';
import { useLogicActionUser } from './useLogicActionUser';

export const ActionUser = memo(() => {
  const navigate = useNavigate();
  const {
    form,
    loadingGetUser,
    userDetail,
    optionListRole,
    handleFinish,
    roleInActive,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
    loginMethod,
    loadingAdd,
    loadingUpdate,
    setRoleInActive,
  } = useLogicActionUser();
  const { id } = useParams();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetUser}>
        <Form
          form={form}
          onFinish={handleFinish}
          labelAlign="left"
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
                    disabled={actionMode === IModeAction.READ}
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
                    disabled={actionMode !== IModeAction.CREATE}
                    onPaste={(event) => {
                      if (actionMode === IModeAction.CREATE) {
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
                    disabled={actionMode === IModeAction.READ}
                    onlyNumber
                    onPaste={(event) =>
                      handlePasteRemoveTextKeepNumber(event, 10)
                    }
                    onInput={(e: AnyElement) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ''))
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Đại lý"
                  name="agency"
                  rules={[{ required: true, message: MESSAGE.G06 }]}
                >
                  <CSelect
                    placeholder="Chọn đại lý"
                    options={[]}
                    maxRow={3}
                    disabled={actionMode === IModeAction.READ}
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
                  label="Hoạt động"
                  name="status"
                  valuePropName="checked"
                >
                  <CSwitch disabled={IModeAction.UPDATE !== actionMode} />
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
              (permission.canDelete ||
                (permission.canUpdate && (
                  <CButtonSave
                    onClick={() => {
                      setIsSubmitBack(true);
                      form.submit();
                    }}
                    loading={loadingAdd || loadingUpdate}
                    disabled={loadingAdd || loadingUpdate}
                  />
                )))}
            {actionMode === IModeAction.READ && permission.canUpdate && (
              <CButtonEdit
                onClick={() => {
                  navigate(pathRoutes.userManagerEdit(id || ''));
                }}
              />
            )}
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
});
