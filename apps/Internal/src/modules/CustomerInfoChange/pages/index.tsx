import CButton from '@react/commons/Button';
import {
  BodyPage,
  Button,
  CModal,
  CSelect,
  NotificationError,
  TitlePage,
} from '@react/commons/index';
import { NotificationWarning } from '@react/commons/Notification';
import { useIsMutating } from '@tanstack/react-query';
import { Col, Flex, Form, Row, Spin, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import {
  onMessageListener,
  requestFcmToken,
} from 'apps/Internal/src/service/firebase';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ActivateInfo from '../components/ActivateInfo';
import CheckOtp, { scrollErrorField } from '../components/CheckOtp';
import FormCheckND13 from '../components/FormCheckND13';
import ModalPdf from '../components/ModalPdf';
import SubscriptionStatus from '../components/SubscriptionStatus';
import { useActivate } from '../hooks/useActivate';
import { useActivateInfo } from '../hooks/useActivateInfo';
import { useCheckTime } from '../hooks/useCheckTime';
import { queryKeyGenContract } from '../hooks/useGenContract';
import { queryKeySendOtp } from '../hooks/useGetOtp';
import '../index.scss';
import useActiveSubscriptStore from '../store';
import { StyledWrapperPage } from './styles';

const ActivateSubscriptionPage = () => {
  const [form] = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpenSensorModal, setIsOpenSensorModal] = useState(false);
  const [formDocument] = Form.useForm();
  const [isPassSensor, setIsPassSensor] = useState(false);

  const {
    resetDataActivateInfo,
    resetGroupStore,
    setFormAntd,
    dataActivateInfo,
    setDeviceToken,
    setSignSuccess,
    setSignND13Success,
    setIsDisabledContract,
    setActiveKeyNd13,
    isOpenModalPdf,
    setOpenModalPdf,
    activeSubmitMore3,
    isSignSuccess,
    isSuccessCheckCondition,
    setSuccessCheckCondition,
    timeError,
    selectedRowKeys,
    isClickCommit,
    otpStatus,
  } = useActiveSubscriptStore();
  const { mutate: mutateCheckTime } = useCheckTime();
  const isLoadingSendOtp = !!useIsMutating({ mutationKey: [queryKeySendOtp] });
  const isLoadingGenContract = !!useIsMutating({
    mutationKey: [queryKeyGenContract],
  });
  const { mutate: mutateActivateInfo, isPending: isLoadingActivateInfo } =
    useActivateInfo();
  const { mutate: mutateActivate, isPending: isLoadingActivate } =
    useActivate();

  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);
  const cardContract = Form.useWatch('cardContract', form);
  const cardCommit = Form.useWatch('cardCommit', form);
  const decree13 = Form.useWatch('decree13', form);
  const isdn = Form.useWatch('phone', form);
  useEffect(() => {
    if (location.pathname === pathRoutes.activateSubscription) {
      mutateCheckTime();
    }

    requestFcmToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log('current token for client: ', currentToken);
          setDeviceToken(currentToken);
          // Perform any other neccessary action with the token
        } else {
          // Show permission request UI
          console.log(
            'No registration token available. Request permission to generate one.'
          );
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });

    setFormAntd(form);
    return () => {
      resetGroupStore();
    };
  }, []);

  onMessageListener()
    .then((payload: any) => {
      form.setFieldsValue({
        fileND13: 'Biên_bản_xác_nhận_NĐ13',
      });
      form.validateFields(['fileND13']);
      setSignND13Success(true);
      setActiveKeyNd13('');
      setSignSuccess(true);
      setIsDisabledContract(true);
    })
    .catch((err) => console.log('failed: ', err));

  useEffect(() => {
    if (cardFront && cardBack && portrait) {
      mutateActivateInfo({
        files: {
          cardFront,
          cardBack,
          portrait,
          enableActiveMore3: '1',
          isdn: isdn,
        },
        data: {
          isdn: isdn,
        },
      });
    }
  }, [cardFront, cardBack, portrait]);

  const handleFinish = () => {
    if (dataActivateInfo.errors?.length > 0 && !isSuccessCheckCondition) return;
    if (dataActivateInfo?.c06_errors) {
      NotificationError(dataActivateInfo?.c06_errors);
      return;
    }
    const passSensor = formDocument.getFieldValue('passSensor');
    formDocument.resetFields();
    setIsOpenSensorModal(false);
    form.validateFields().then((values: any) => {
      if (!activeSubmitMore3) {
        NotificationError('User không có quyền kích hoạt lớn hơn 3 thuê bao');
        return;
      }
      if (!isSignSuccess && (!cardContract || !cardCommit)) {
        NotificationError(
          'Không có thông tin ảnh hợp đồng/Biên bản xác nhận, bản cam kết chính chủ. Vui lòng tạo biểu mẫu hoặc tạo link ký'
        );
        return;
      }

      mutateActivate({
        files: {
          front: cardFront,
          back: cardBack,
          portrait: portrait,
          convince: cardContract,
          decree13: decree13,
          ownershipCommitment: cardCommit,
        },
        form: {
          ...values,
          passSensor: passSensor,
          id_ekyc: dataActivateInfo.id_ekyc,
          decree13Accept: selectedRowKeys,
          otpStatus: otpStatus,
        },
      });
    });
  };

  const reasonOptions = [
    {
      label: 'Hồ sơ đi vào Kiểm duyệt',
      value: 1,
    },
    {
      label: 'Hồ sơ đi vào Hậu kiểm',
      value: 2,
    },
  ];

  const handleClose = useCallback(() => {
    form.resetFields();
    // resetPackageServiceStore();
    navigate(-1);
  }, [
    form,
    navigate,
    // , resetPackageServiceStore
  ]);

  const handleCancel = () => {
    setIsOpenSensorModal(false);
    formDocument.resetFields();
  };

  const handleRefresh = () => {
    form.resetFields();
    setSuccessCheckCondition(false);
    resetDataActivateInfo();
    resetGroupStore();
    formDocument.resetFields();
    setIsOpenSensorModal(false);
  };

  return (
    <StyledWrapperPage>
      <TitlePage>Thay đổi thông tin thuê bao</TitlePage>
      <BodyPage>
        <Spin
          spinning={
            isLoadingSendOtp ||
            isLoadingActivateInfo ||
            isLoadingGenContract ||
            isLoadingActivate
          }
        >
          {!!timeError && (
            <div className="flex justify-end">
              <Typography.Title type="danger" level={5}>
                {timeError}
              </Typography.Title>
            </div>
          )}

          <Form
            form={form}
            onChange={(e) => console.log(e)}
            layout="horizontal"
            scrollToFirstError
            initialValues={{
              document: '1',
              cusType: 'VNS',
            }}
            labelCol={{
              lg: { span: 12 },
              xl: { span: 6 },
              prefixCls: 'subscription--form-label',
            }}
            labelWrap
            disabled={!!timeError}
          >
            <Form.Item name="contractId" hidden />
            <Form.Item name="customerId" hidden />
            <Form.Item name="otpReason" hidden />
            {/* <CustomerInfo /> */}
            <ActivateInfo />
            <SubscriptionStatus />
            <FormCheckND13 />
            <CheckOtp />
            {isOpenModalPdf && (
              <ModalPdf
                isOpen={isOpenModalPdf}
                setIsOpen={setOpenModalPdf}
                isSigned={false}
                isCommit={isClickCommit}
              />
            )}

            <Row gutter={16}>
              <Col span={24}>
                <Flex justify="end">
                  <CButton
                    disabled={false}
                    onClick={handleRefresh}
                    className="mt-1 w-[8.5rem] mr-5"
                  >
                    Làm mới
                  </CButton>
                  <Button
                    loading={isLoadingActivate}
                    className="mt-1 w-[8.5rem]"
                    onClick={() =>
                      form.validateFields().then(() => {
                        if (
                          !form.getFieldValue('expiry') &&
                          !form.getFieldValue('idExpiryDateNote')
                        ) {
                          NotificationWarning(
                            'Vui lòng điền thông tin Ngày hết hạn giấy tờ hoặc Ngày hết hạn'
                          );
                        } else {
                          setIsOpenSensorModal(true);
                        }
                      })
                    }
                  >
                    Thay đổi thông tin
                  </Button>
                  <CModal
                    title={'Chuyển hồ sơ'}
                    open={isOpenSensorModal}
                    onCancel={handleCancel}
                    footer={[
                      <Button
                        key="close"
                        type="default"
                        loading={isLoadingActivate}
                        onClick={handleCancel}
                      >
                        Đóng
                      </Button>,
                      <CButton
                        key="submit"
                        htmlType="submit"
                        loading={isLoadingActivate}
                        onClick={() => {
                          if (formDocument.getFieldValue('passSensor') === 0) {
                            setIsPassSensor(false);
                          } else if (
                            formDocument.getFieldValue('passSensor') === 1
                          ) {
                            setIsPassSensor(true);
                          }
                          formDocument.submit();
                        }}
                      >
                        Xác nhận
                      </CButton>,
                    ]}
                  >
                    <Form
                      form={formDocument}
                      colon={false}
                      layout="vertical"
                      onFinish={() => {
                        handleFinish();
                        scrollErrorField();
                      }}
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
                </Flex>
              </Col>
            </Row>
          </Form>
        </Spin>
      </BodyPage>
    </StyledWrapperPage>
  );
};

export default ActivateSubscriptionPage;
