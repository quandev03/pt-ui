import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  CInput,
  CSelect,
  CSwitch,
  IModeAction,
  ModalConfirm,
  TitleHeader,
  cleanUpPhoneNumber,
  cleanUpString,
  emailRegex,
  handlePasteRemoveSpace,
  handlePasteRemoveTextKeepNumber,
  phoneRegex,
  usePermissions,
} from '@vissoft-react/common';
import { Col, Form, Radio, Row, Spin } from 'antd';
import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pathRoutes } from '../../../../routers';
import useConfigAppStore from '../../../Layouts/stores';
import { useGetDepartments } from '../../hooks';
import { useLogicActionUser } from './useLogicActionUser';

export const ActionUser = memo(() => {
  const navigate = useNavigate();
  const {
    form,
    loadingGetUser,
    userDetail,
    optionGroups,
    optionListRole,
    optionOrganization,
    handleFinish,
    roleInActive,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
    loginMethod,
    checkAllowDelete,
    loadingAdd,
    loadingUpdate,
    loadingDelete,
    setRoleInActive,
    groupsInActive,
    setGroupsInActive,
  } = useLogicActionUser();
  const { id } = useParams();
  const { data: INTERNAL_DEPARTMENT = [] } = useGetDepartments();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);

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
                  <Radio.Group disabled={IModeAction.CREATE !== actionMode}>
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
                  <CSwitch disabled={IModeAction.UPDATE !== actionMode} />
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
                      actionMode !== IModeAction.CREATE || loginMethod === '2'
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
                    disabled={actionMode === IModeAction.READ}
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
                <Form.Item label="Nhóm tài khoản" name="groupIds">
                  <CSelect
                    placeholder="Chọn nhóm tài khoản"
                    options={optionGroups}
                    mode="multiple"
                    maxRow={3}
                    disabled={actionMode === IModeAction.READ}
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
                    disabled={actionMode === IModeAction.READ}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phòng ban" name="departmentIds">
                  <CSelect
                    placeholder="Chọn phòng ban"
                    options={INTERNAL_DEPARTMENT}
                    disabled={actionMode === IModeAction.READ}
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
            {actionMode === IModeAction.READ && (
              <>
                {permission.canDelete && (
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
                )}
                {permission.canUpdate && (
                  <CButtonEdit
                    onClick={() => {
                      navigate(pathRoutes.systemUserManagerEdit(id!));
                    }}
                  />
                )}
              </>
            )}
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
});
