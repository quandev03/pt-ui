import { CButtonClose } from '@react/commons/Button';
import { BodyPage, Button, TitlePage } from '@react/commons/index';
import { useIsMutating } from '@tanstack/react-query';
import { Col, Flex, Form, Row, Spin, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import {
  onMessageListener,
  requestFcmToken,
} from 'apps/Internal/src/service/firebase';
import { useEffect } from 'react';
import ContracInfo from '../components/ContractInfo';
import ContractSign from '../components/ContractSign';
import EnterpriseInfo from '../components/EnterpriseInfo';
import FormCheckND13 from '../components/FormCheckND13';
import ModalPdf from '../components/ModalPdf';
import SubscriptionInfo from '../components/SubscriptionInfo';
import { useActivate } from '../hooks/useActivate';
import { useCheckTime } from '../hooks/useCheckTime';
import { queryKeyGenContract } from '../hooks/useGenContract';
import '../index.scss';
import useActivateM2M from '../store';
import { StyledWrapperPage } from './styles';
const ActivateSubscriptionPage = () => {
  const [form] = useForm();

  const {
    resetGroupStore,
    setFormAntd,
    setDeviceToken,
    setSignSuccess,
    setSignND13Success,
    setIsDisabledContract,
    setActiveKeyNd13,
    isOpenModalPdf,
    setOpenModalPdf,
    timeError,
    setIsGenCode,
  } = useActivateM2M();
  const { mutate: mutateCheckTime } = useCheckTime();
  const isLoadingGenContract = !!useIsMutating({
    mutationKey: [queryKeyGenContract],
  });
  const { mutate: mutateActivate, isPending: isLoadingActivate } =
    useActivate();
  const isdnFile = Form.useWatch('isdnFile', form);
  const contract = Form.useWatch('contract', form);
  const fileND13 = Form.useWatch('decree13', form);

  useEffect(() => {
    resetGroupStore();
    mutateCheckTime();

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

  const handleFinish = () => {
    console.log('IM HERE');

    form.validateFields().then((values: any) => {
      mutateActivate({
        files: {
          isdnFile: isdnFile,
          contract: contract,
          decree13: fileND13,
        },
        form: {
          ...values,
        },
      });
    });
  };

  return (
    <StyledWrapperPage>
      <TitlePage>{'Kích hoạt thuê bao doanh nghiệp M2M'}</TitlePage>
      <BodyPage>
        <Spin spinning={isLoadingGenContract}>
          {!!timeError && (
            <div className="flex justify-end">
              <Typography.Title type="danger" level={5}>
                {timeError}
              </Typography.Title>
            </div>
          )}

          <Form
            form={form}
            layout="horizontal"
            labelCol={{ prefixCls: 'subscription--form-label' }}
            scrollToFirstError
            initialValues={{
              document: '1',
            }}
            disabled={!!timeError}
            onFinish={handleFinish}
          >
            <Form.Item name="authorizedFilePath" hidden />
            <Form.Item name="supervisorId" hidden />
            <EnterpriseInfo />
            <ContracInfo />
            <ContractSign />
            <FormCheckND13 />
            <SubscriptionInfo />
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
                    className="mt-1 w-[8.5rem] mr-2"
                    onClick={() => form.submit()}
                  >
                    Kích hoạt
                  </Button>
                  <CButtonClose
                    loading={isLoadingActivate}
                    className="mt-1 w-[8.5rem]"
                    onClick={() => {
                      const contractCode = form.getFieldValue('contractNoM2M');
                      form.resetFields();
                      resetGroupStore();
                      setIsGenCode(false);
                      form.setFieldValue('contractNoM2M', contractCode);
                    }}
                  >
                    Hủy
                  </CButtonClose>
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
