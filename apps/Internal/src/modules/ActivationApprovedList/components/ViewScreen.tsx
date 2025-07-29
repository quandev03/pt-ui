import { faCancel, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonClose } from '@react/commons/Button';
import {
  BodyPage,
  CModal,
  CSelect,
  NotificationSuccess,
  WrapperPage,
} from '@react/commons/index';
import { RowButton } from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { Flex, Form, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { FC, Key, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import ActivationRequestList from '../../ActivationRequestList/components/ViewUpdate';
import '../index.scss';
import { useAcceptFn } from '../queryHook/useAccept';
import RejectModal from './RejectModal';

const ViewApprove: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const intl = useIntl();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const { mutate: acceptMutate, isPending: isPendingAccept } = useAcceptFn(
    () => {
      NotificationSuccess('Phê duyệt yêu cầu kích hoạt thành công');
      navigate(-1);
    },
    () => {
      console.log('hahhahaha');
    }
  );
  const [isPassSensor, setIsPassSensor] = useState(false);
  const [isOpenSensorModal, setIsOpenSensorModal] = useState(false);
  const [formDocument] = Form.useForm();
  const listRoleByRouter = useRolesByRouter();
  const reasonOptions = [
    {
      label: 'Hồ sơ đi vào Kiểm duyệt',
      value: 0,
    },
    {
      label: 'Hồ sơ đi vào Hậu kiểm',
      value: 1,
    },
  ];

  const handleCloseModal = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    setIsOpenSensorModal(false);
    formDocument.resetFields();
  };

  const handleStartAccept = () => {
    form.setFieldValue('listIds', [id]);
    form.setFieldValue('passSensor', isPassSensor);
    setIsOpenSensorModal(false);
    acceptMutate(form.getFieldsValue());
    formDocument.resetFields();
  };

  return (
    <WrapperPage>
      <BodyPage>
        <Spin spinning={isPendingAccept}>
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ prefixCls: 'subscription--form-label' }}
            // onFinish={handleFinish}
            scrollToFirstError={true}
            initialValues={{
              document: '1',
            }}
          >
            <ActivationRequestList
              typeModal={ActionType.VIEW}
              isFromApprove={true}
            />
            <Flex justify="center">
              <RowButton className="my-6">
                <Form.Item name="saveForm"></Form.Item>
                <Form.Item name="passSensor"></Form.Item>
                <Form.Item name="listIds" hidden></Form.Item>
                {includes(listRoleByRouter, ActionsTypeEnum.APPROVED) && (
                  <CButton
                    onClick={() => {
                      setIsOpenSensorModal(true);
                    }}
                    icon={<FontAwesomeIcon icon={faCheck} />}
                  >
                    {<FormattedMessage id={'Phê duyệt'} />}
                  </CButton>
                )}
                {includes(listRoleByRouter, ActionsTypeEnum.REJECT) && (
                  <CButton
                    onClick={() => {
                      setSelectedRowKeys([id as string]);
                      setIsOpenModal(true);
                    }}
                    icon={<FontAwesomeIcon icon={faCancel} />}
                    style={{
                      backgroundColor: '#ff4d4d',
                      borderColor: '#ff4d4d',
                      color: 'white',
                    }}
                  >
                    {intl.formatMessage({ id: 'Từ chối' })}
                  </CButton>
                )}
                <CButtonClose onClick={handleCloseModal}></CButtonClose>
              </RowButton>
            </Flex>
            <CModal
              title={'Chọn hồ sơ tiền kiểm'}
              open={isOpenSensorModal}
              onCancel={handleCancel}
              footer={[
                <CButtonClose key="close" type="default" onClick={handleCancel}>
                  Đóng
                </CButtonClose>,
                <CButton
                  key="submit"
                  htmlType="submit"
                  onClick={() => {
                    if (formDocument.getFieldValue('passSensor') === 0) {
                      setIsPassSensor(false);
                    } else if (formDocument.getFieldValue('passSensor') === 1) {
                      setIsPassSensor(true);
                    }
                    formDocument.submit();
                  }}
                  icon={<FontAwesomeIcon icon={faCheck} />}
                >
                  Xác nhận
                </CButton>,
              ]}
            >
              <Form
                form={formDocument}
                colon={false}
                layout="vertical"
                onFinish={handleStartAccept}
                validateTrigger={['onSubmit']}
                // initialValues={{'passSensor': -1}}
              >
                <Form.Item
                  label="Chọn hồ sơ"
                  name="passSensor"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống trường này',
                    },
                  ]}
                >
                  <CSelect
                    showSearch={false}
                    placeholder="Chọn hồ sơ"
                    options={reasonOptions}
                  />
                </Form.Item>
              </Form>
            </CModal>
            <RejectModal
              isOpen={isOpenModal}
              setIsOpen={setIsOpenModal}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />
          </Form>
        </Spin>
      </BodyPage>
    </WrapperPage>
  );
};

export default ViewApprove;
