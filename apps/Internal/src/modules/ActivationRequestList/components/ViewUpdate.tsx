import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonClose, CButtonEdit } from '@react/commons/Button';
import { BodyPage, TitlePage, WrapperPage } from '@react/commons/index';
import { NotificationWarning } from '@react/commons/Notification';
import { RowButton } from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { useIsMutating } from '@tanstack/react-query';
import { Flex, Form, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { requestFcmToken } from 'apps/Internal/src/service/firebase';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActivateInfo } from '../../ActivationRequestList/queryHook/useActivateInfo';
import CheckOtp from '../components/CheckOtp';
import '../index.scss';
import { useActivate } from '../queryHook/useActivate';
import { queryKeyGenContract } from '../queryHook/useGenContract';
import { queryKeySendOtp } from '../queryHook/useGetOtp';
import { useView } from '../queryHook/useView';
import { useActiveSubscriptStore } from '../store';
import ActivateInfo from './ActivateInfo';
import CustomerInfo from './CustomerInfo';
import FormCheckND13 from './FormCheckND13';

type Props = {
  typeModal: ActionType;
  isFromApprove: boolean;
};

const ActivateRequestListPage: FC<Props> = ({ typeModal, isFromApprove }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const [name, setName] = useState('');
  const listRoleByRouter = useRolesByRouter();
  const isLoadingSendOtp = !!useIsMutating({ mutationKey: [queryKeySendOtp] });
  const { cardFront, cardBack, portrait, cardContract,phone,serialSim } =
    Form.useWatch((value) => value, form) ?? {};
  console.log(
    'FRONTTTTTTT ',
    cardFront,
    ' BACKK',
    cardBack,
    ' portrait ',
    portrait,
    ' CONTRACT ',
    cardContract
  );
  const {
    resetGroupStore,
    setFormAntd,
    dataActivateInfo,
    dataActivationRequest,
    setDeviceToken,
    isSignAgainFlag,
    isSignSuccess,
    isSuccessCheckCondition,
    setIsSignAgainFlag,
    isChangeValue,
  } = useActiveSubscriptStore();
  const { mutate: mutateActivateInfo, isPending: isLoadingActivateInfo } =
    useActivateInfo(form);
  const { mutate: mutateActivate, isPending: isLoadingActivate } =
    useActivate(form);
  const isLoadingGenContract = !!useIsMutating({
    mutationKey: [queryKeyGenContract],
  });

  const { mutate: mutateActivationView, data: dataActivationView } = useView(
    (data) => {
      form.setFieldsValue({
        ...data,
        oldName: data.name,
        phone: '0' + data.isdn,
        serialSim: data.serial,
        document: data.idType,
        id: data.idNo,
        issue_by: data.idIssuePlace,
        issue_date: dayjs(data.idIssueDate, 'YYYY-MM-DD'),
        birthday: dayjs(data.birthDate, 'YYYY-MM-DD'),
        city: data.province,
        district: data.district,
        ward: data.precinct,
        expiry: data.idExpireDate
          ? dayjs(data.idExpireDate, 'YYYY-MM-DD')
          : null,
        idExpireDate: data.idExpireDateNote,
        fileND13: 'Biên_bản_xác_nhận_NĐ13',
      });
      setName(data.name);
      form.setFieldValue('codeDecree13', data.decree13Accept.split(','));
    }
  );

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (cardFront && cardBack && portrait) {
      console.log('FRONT ', cardFront, ' back ', cardBack);
      mutateActivateInfo(
        {
          files:{ cardFront, cardBack, portrait },data:{ isdn: phone.replace(/^0+/, ''), serial: serialSim },
        }
      );
    }
  }, [cardFront, cardBack, portrait]);

  useEffect(() => {
    if (cardFront && cardBack && portrait && isSuccessCheckCondition) {
      setIsSignAgainFlag(true);
    }
  }, [cardFront, cardBack, portrait, isSuccessCheckCondition]);
  useEffect(() => {
    setFormAntd(form);
    return () => {
      resetGroupStore();
    };
  }, []);

  useEffect(() => {
    if (id) {
      mutateActivationView(id!);
    }
  }, []);

  const handleFinish = (values: any) => {
    if (!isSuccessCheckCondition && isChangeValue) {
      console.log('0');
      NotificationWarning('Vui lòng thực hiện kiểm tra thông tin');
    } else {
      console.log('1');
      if (form.getFieldValue('name') !== name || dataActivationRequest.id) {
        setIsSignAgainFlag(true);
      } else {
        setIsSignAgainFlag(false);
      }
      if (isSignAgainFlag && cardContract === undefined && !isSignSuccess) {
        console.log('2 check ', isSuccessCheckCondition && isSignAgainFlag);
        NotificationWarning(
          'Bạn đã sửa các thông tin có trong hợp đồng/biểu mẫu. Vui lòng kí lại hợp đồng/biểu mẫu.'
        );
      } else {
        console.log('3');

        if (
          cardFront === undefined &&
          cardBack === undefined &&
          portrait === undefined &&
          cardContract === undefined
        ) {
          console.log('4');
          form.resetFields(['ucardFront']);
          form.resetFields(['cardBack']);
          form.resetFields(['portrait']);
          form.resetFields(['cardContract']);
          console.log(dataActivationRequest);

          mutateActivate({
            id: id,
            files: {
              front: cardFront,
              back: cardBack,
              portrait: portrait,
              convince: cardContract,
            },
            form: {
              ...values,
              // id_ekyc: dataActivateInfo.id_ekyc,
              // document: dataActivateInfo.document,
            },
          });
        } else {
          console.log('5');
          mutateActivate({
            id: id,
            files: {
              front: cardFront,
              back: cardBack,
              portrait: portrait,
              convince: cardContract,
            },
            form: {
              ...values,
              id_ekyc: dataActivateInfo.id_ekyc,
              // document: dataActivateInfo.document,
            },
          });
        }
      }
    }
  };

  const handleCloseModal = () => {
    resetGroupStore();
    navigate(-1);
  };

  const renderTitle = () => {
    if (!isFromApprove) {
      return typeModal === ActionType.VIEW
        ? 'Xem chi tiết yêu cầu kích hoạt'
        : 'Chỉnh sửa yêu cầu kích hoạt';
    } else {
      return 'Chi tiết hồ sơ tiền kiểm';
    }
  };

  return (
    <WrapperPage>
      <TitlePage>{renderTitle()}</TitlePage>
      <br />
      <BodyPage>
        <Spin
          spinning={
            isLoadingSendOtp ||
            isLoadingGenContract ||
            isLoadingActivateInfo ||
            isLoadingActivate
          }
        >
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ prefixCls: 'subscription--form-label' }}
            onFinish={handleFinish}
            scrollToFirstError={true}
            initialValues={{
              document: '1',
            }}
          >
            <Form.Item label="" name="oldName" hidden />
            <Form.Item label="" name="codeDecree13" hidden />
            <CustomerInfo typeModal={typeModal} isFromApprove={isFromApprove} />
            <FormCheckND13  dataActivationView={dataActivationView} />
            <ActivateInfo typeModal={typeModal} isFromApprove={isFromApprove} />
            <CheckOtp typeModal={typeModal} />
            {!isFromApprove && (
              <Flex justify="center">
                <RowButton className="my-6">
                  <Form.Item name="saveForm"></Form.Item>
                  {typeModal === ActionType.VIEW &&
                    form.getFieldValue('approveStatus') === 2 &&
                    includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
                      <CButtonEdit
                        className="mt-1 w-[8.5rem]"
                        onClick={() =>
                          navigate(pathRoutes.activationRequestListEdit(id))
                        }
                        // loading={loadingAdd}
                      ></CButtonEdit>
                    )}
                  {typeModal === ActionType.EDIT &&
                    includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
                      <CButton
                        className="mt-1 w-[8.5rem]"
                        htmlType="submit"
                        icon={<FontAwesomeIcon icon={faUndo} />}
                        // loading={loadingAdd}
                      >
                        Gửi lại
                      </CButton>
                    )}

                  <CButtonClose
                    type="default"
                    className="mt-1 w-[8.5rem]"
                    onClick={handleCloseModal}
                  ></CButtonClose>
                </RowButton>
              </Flex>
            )}
          </Form>
        </Spin>
      </BodyPage>
    </WrapperPage>
  );
};

export default ActivateRequestListPage;
