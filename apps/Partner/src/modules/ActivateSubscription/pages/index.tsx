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
import { useActivate } from '../hooks/useActivate';
import useActiveSubscriptStore from '../store';
import FormCheckND13 from '../components/FormCheckND13';
import { useNavigate } from 'react-router-dom';
import ModalPdf from '../components/ModalPdf';
import { StyledWrapperPage } from './styles';
import { useCheckTime } from '../hooks/useCheckTime';
import { includes } from 'lodash';
import { ActionsTypeEnum, IDType } from '@react/constants/app';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import useCheckBlackList from '../hooks/useCheckBlackList';

const ActivateSubscriptionPage = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const {
    resetDataActivateInfo,
    resetGroupStore,
    setFormAntd,
    dataActivateInfo,
    isOpenModalPdf,
    setOpenModalPdf,
    activeSubmitMore3,
    isSignSuccess,
    isSuccessCheckCondition,
    setSuccessCheckCondition,
    timeError,
    selectedRowKeys,
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
  const { isSuccess: isSuccessCheckBlackList } = useCheckBlackList();

  const pkName = Form.useWatch('pkName', form);
  const checkSimError = Form.useWatch('checkSimError', form);
  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);
  const cardContract = Form.useWatch('cardContract', form);
  const decree13 = Form.useWatch('decree13', form);
  const phoneInfo = Form.useWatch('phone', form);
  const serialSimInfo = Form.useWatch('serialSim', form);
  useEffect(() => {
    mutateCheckTime();
    setFormAntd(form);
    return () => {
      resetGroupStore();
    };
  }, []);

  useEffect(() => {
    if (cardFront && cardBack && portrait) {
      mutateActivateInfo({
        files:{
          cardFront,
          cardBack,
          portrait,
          enableActiveMore3: includes(
            listRoleByRouter,
            ActionsTypeEnum.ACTIVATE_SUBSCRIBER_MASH
          )
            ? '1'
            : '0',
        },
        data:{
          isdn: phoneInfo, 
          serial: serialSimInfo
        }
      });
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
      });
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
      <TitlePage>Kích hoạt thuê bao</TitlePage>
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
          </Form>
        </Spin>
      </BodyPage>
    </StyledWrapperPage>
  );
};

export default ActivateSubscriptionPage;
