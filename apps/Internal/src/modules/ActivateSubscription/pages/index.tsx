import {
  BodyPage,
  Button,
  NotificationError,
  TitlePage,
} from '@react/commons/index';
import { useIsMutating } from '@tanstack/react-query';
import { Col, Flex, Form, Row, Spin, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect } from 'react';
import ActivateInfo from '../components/ActivateInfo';
import CheckOtp, { scrollErrorField } from '../components/CheckOtp';
import CustomerInfo from '../components/CustomerInfo';
import { useActivateInfo } from '../hooks/useActivateInfo';
import { queryKeySendOtp } from '../hooks/useGetOtp';
import '../index.scss';
import { queryKeyGenContract } from '../hooks/useGenContract';
import { useActivate, useActivateRequest } from '../hooks/useActivate';
import useActiveSubscriptStore from '../store';
import {
  onMessageListener,
  requestFcmToken,
} from 'apps/Internal/src/service/firebase';
import FormCheckND13 from '../components/FormCheckND13';
import { RowButton } from '@react/commons/Template/style';
import { FormattedMessage } from 'react-intl';
import CButton, { CButtonClose } from '@react/commons/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import ModalPdf from '../components/ModalPdf';
import { StyledWrapperPage } from './styles';
import { useCheckTime } from '../hooks/useCheckTime';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { ActionsTypeEnum } from '@react/constants/app';
import path from 'path';
import { IDType } from '../../VerificationList/types';
import useCheckBlackList from '../hooks/useCheckBlackList';

const ActivateSubscriptionPage = () => {
  const [form] = useForm();
  const location = useLocation();
  const navigate = useNavigate();

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
    contractUploadType
  } = useActiveSubscriptStore();
  const { mutate: mutateCheckTime } = useCheckTime();
  const listRoleByRouter = useRolesByRouter();
  const isLoadingSendOtp = !!useIsMutating({ mutationKey: [queryKeySendOtp] });
  const isLoadingGenContract = !!useIsMutating({
    mutationKey: [queryKeyGenContract],
  });
  const { mutate: mutateActivateInfo, isPending: isLoadingActivateInfo } =
    useActivateInfo();
  const { mutate: mutateActivate, isPending: isLoadingActivate } =
    useActivate();

  const { mutate: mutateActivateRequest, isPending: isLoadingActivateRequest } =
    useActivateRequest();

  const pkName = Form.useWatch('pkName', form);
  const checkSimError = Form.useWatch('checkSimError', form);
  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);
  const cardContract = Form.useWatch('cardContract', form);
  const decree13 = Form.useWatch('decree13', form);
  const phoneInfo = Form.useWatch('phone', form);
  const serialSimInfo = Form.useWatch('serialSim', form);
  const { isSuccess: isSuccessCheckBlackList } = useCheckBlackList();
  useEffect(() => {
    resetGroupStore();
    form.resetFields();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== pathRoutes.activationRequestListCreate) {
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
      mutateActivateInfo(
        {
          files: {
            cardFront,
            cardBack,
            portrait,
            enableActiveMore3:
              ((location.pathname === pathRoutes.activateSubscription ||
                location.pathname ===
                pathRoutes.enterpriseCustomerManagementH2HActive) &&
                includes(
                  listRoleByRouter,
                  ActionsTypeEnum.ACTIVATE_SUBSCRIBER_MASH
                )) ||
                (location.pathname === pathRoutes.activationRequestListCreate &&
                  includes(listRoleByRouter, ActionsTypeEnum.CREATE_MASH_REQUEST))
                ? '1'
                : '0',
          },
          data: { isdn: phoneInfo.replace(/^0+/, ''), serial: serialSimInfo }
        }
      );
    }
  }, [cardFront, cardBack, portrait]);

  const handleFinish = () => {
    if (dataActivateInfo.errors?.length > 0 && !isSuccessCheckCondition) return;
    if (dataActivateInfo?.c06_errors) {
      NotificationError(dataActivateInfo?.c06_errors);
      return;
    }
    form.validateFields().then((values: any) => {
      if (!pkName) {
        NotificationError(checkSimError);
        return;
      }
      if (!activeSubmitMore3) {
        NotificationError('User không có quyền kích hoạt lớn hơn 3 thuê bao');
        return;
      }
      if (!isSignSuccess && !cardContract) {
        NotificationError(
          'Không có thông tin ảnh hợp đồng. Vui lòng tạo biểu mẫu hoặc tạo link ký'
        );
        return;
      }
      if (values.document === IDType.CMND) {
        NotificationError(
          'Từ ngày 01/01/2025 không thể kích hoạt với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
        );
        return;
      }
      if (!values.expiry && !values.idExpiryDateNote) {
        NotificationError(
          'Vui lòng điền thông tin Ngày hết hạn giấy tờ hoặc Ngày hết hạn'
        );
        return;
      }
      if (location.pathname === pathRoutes.activationRequestListCreate) {
        mutateActivateRequest({
          files: {
            front: cardFront,
            back: cardBack,
            portrait: portrait,
            convince: cardContract,
            decree13: decree13,
          },
          form: {
            ...values,
            id_ekyc: dataActivateInfo.id_ekyc,
            document: dataActivateInfo.document,
            decree13Accept: selectedRowKeys,
          },
          contractUploadType: contractUploadType,
        });
      } else {
        mutateActivate({
          files: {
            front: cardFront,
            back: cardBack,
            portrait: portrait,
            convince: cardContract,
            decree13: decree13,
          },
          form: {
            ...values,
            id_ekyc: dataActivateInfo.id_ekyc,
            decree13Accept: selectedRowKeys,
          },
          contractUploadType: contractUploadType,
        });
      }
    });
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    // resetPackageServiceStore();
    navigate(-1);
  }, [
    form,
    navigate,
    // , resetPackageServiceStore
  ]);

  const handleCloseModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleRefresh = () => {
    form.resetFields();
    setSuccessCheckCondition(false);
    resetDataActivateInfo();
  };

  return (
    <StyledWrapperPage>
      <TitlePage>
        {location.pathname === pathRoutes.activationRequestListCreate
          ? 'Yêu cầu kích hoạt'
          : 'Kích hoạt thuê bao'}
      </TitlePage>
      <BodyPage>
        <Spin
          spinning={
            isLoadingSendOtp || isLoadingActivateInfo || isLoadingGenContract
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
            labelCol={{ prefixCls: 'subscription--form-label' }}
            scrollToFirstError
            initialValues={{
              document: '1',
            }}
            disabled={!!timeError || isSuccessCheckBlackList}
          >
            <CustomerInfo />
            <FormCheckND13 />
            <ActivateInfo />
            <CheckOtp />
            {isOpenModalPdf && (
              <ModalPdf
                isOpen={isOpenModalPdf}
                setIsOpen={setOpenModalPdf}
                isSigned={false}
              />
            )}
            {location.pathname !== pathRoutes.activationRequestListCreate && (
              <Row gutter={16}>
                <Col span={24}>
                  <Flex justify="end">
                    <Button
                      loading={isLoadingActivate}
                      className="mt-1 w-[8.5rem]"
                      onClick={() => {
                        handleFinish();
                        scrollErrorField();
                      }}
                    >
                      Kích hoạt
                    </Button>
                  </Flex>
                </Col>
              </Row>
            )}
            {location.pathname === pathRoutes.activationRequestListCreate && (
              <Flex justify="center">
                <RowButton className="my-6">
                  <Form.Item name="saveForm"></Form.Item>
                  <CButtonClose
                    type="default"
                    className="mt-1 w-[8.5rem]"
                    onClick={handleCloseModal}
                  >
                    Đóng
                  </CButtonClose>
                  <CButton
                    loading={isLoadingActivateRequest}
                    disabled={false}
                    onClick={handleRefresh}
                    className="mt-1 w-[8.5rem]"
                  >
                    Làm mới
                  </CButton>
                  <CButton
                    className="mt-1 w-[8.5rem]"
                    onClick={() => {
                      form.setFieldsValue({
                        saveForm: false,
                      });
                      handleFinish();
                    }}
                  // loading={loadingAdd}
                  >
                    <FormattedMessage id="Tạo yêu cầu" />
                  </CButton>
                </RowButton>
              </Flex>
            )}
          </Form>
        </Spin>
      </BodyPage>
    </StyledWrapperPage>
  );
};

export default ActivateSubscriptionPage;
