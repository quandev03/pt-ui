import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  CInput,
  cleanUpString,
  CSwitch,
  IModeAction,
  MESSAGE,
  TitleHeader,
  usePermissions,
} from '@vissoft-react/common';
import { Col, Form, Row, Spin, TreeSelect } from 'antd';
import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pathRoutes } from '../../../../../src/routers';
import useConfigAppStore from '../../../Layouts/stores';
import { useLogicActionAgency } from './useLogicActionAgency';

export const AgencyAction = memo(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const {
    form,
    loadingGetAgency,
    loadingAdd,
    loadingUpdate,
    handleFinish,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
    loadingListAgency,
    listParentId,
    mapStockParent,
    agencyDetail,
  } = useLogicActionAgency();
  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetAgency}>
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
                  <CSwitch disabled={IModeAction.UPDATE !== actionMode} />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  label="Mã đối tác"
                  name="orgCode"
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
                    placeholder="Nhập mã đối tác"
                    maxLength={30}
                    disabled={actionMode === IModeAction.READ}
                    preventSpecialExceptHyphenAndUnderscore
                    preventSpace
                    preventVietnamese
                    uppercase
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên đối tác"
                  name="orgName"
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
                    placeholder="Nhập tên đối tác"
                    maxLength={100}
                    disabled={actionMode === IModeAction.READ}
                    onBlur={(e) => {
                      const value = cleanUpString(e.target.value);
                      form.setFieldValue('orgName', value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Đại lý cha"
                  name="parentId"
                  rules={[{ required: true, message: MESSAGE.G06 }]}
                >
                  <TreeSelect
                    placeholder="Chọn đại lý cha"
                    showSearch
                    treeDefaultExpandAll
                    treeNodeFilterProp="title"
                    disabled={
                      actionMode === IModeAction.READ ||
                      agencyDetail?.parentId === null
                    }
                    loading={loadingListAgency}
                    treeData={mapStockParent(listParentId || [])}
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
            {actionMode === IModeAction.READ && permission.canUpdate && (
              <CButtonEdit
                onClick={() => {
                  navigate(pathRoutes.agencyEdit(id || ''));
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
