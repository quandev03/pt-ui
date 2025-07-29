import {
  faBullhorn,
  faCheck,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
} from '@react/commons/Button';
import { BodyPage } from '@react/commons/index';
import {
  NotificationError,
  NotificationWarning,
} from '@react/commons/Notification';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { formatDate } from '@react/constants/moment';
import { MESSAGE } from '@react/utils/message';
import { useIsMutating } from '@tanstack/react-query';
import { Col, Flex, Form, Row, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  onMessageListener,
  requestFcmToken,
} from 'apps/Internal/src/service/firebase';
import { useAcceptRequest } from '../hooks/useAcceptRequest';
import { useActivateInfo } from '../hooks/useActivateInfo';
import { useEditSubDoc } from '../hooks/useEditSubDoc';
import { queryKeyGenContract } from '../hooks/useGenContract';
import { useSynchronize } from '../hooks/useSynchronize';
import { useViewSubDoc } from '../hooks/useViewSubDoc';
import useCensorshipStore from '../store';
import ActivateInfo from './ActivateInfo';
import CustomerInfo from './CustomerInfo';
import { ModalRequestUpdate } from './DocumentUpdateHistory/ModalRequestUpdate';
import FormCheckND13 from './FormCheckND13';
import SignitureFormat from './SignitureFormat';
import Status from './Status';
import { TypeContractUpload } from '../types';

type Props = {
  typeModal: ActionType;
};

const CensorshipRequest: React.FC<Props> = ({ typeModal }) => {
  const renderTitle = () => {
    const name = ' yêu cầu kiểm duyệt';
    switch (typeModal) {
      case ActionType.EDIT:
        return 'Chỉnh sửa' + name;
      case ActionType.VIEW:
        return 'Chi tiết' + name;
      default:
        return '';
    }
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const actionByRole = useRolesByRouter();
  const { mutate: mutateActivateInfo, isPending: isLoadingActivateInfo } =
    useActivateInfo();

  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);
  const cardContract = Form.useWatch('cardContract', form);
  const decree13 = Form.useWatch('decree13', form);
  const serialSimInfo = Form.useWatch('serialSim', form);
  const isdnInfo = Form.useWatch('phoneNumber', form);
  const [isShowSignLink, setIsShowSignLink] = useState(false);
  const [isOpenReqModal, setIsOpenReqModal] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const {
    setFormAntd,
    setDeviceToken,
    setIsDisabledContract,
    setIsSignSuccess,
    resetGroupStore,
    setSubDocDetail,
    isSignSuccess,
    dataActivateInfo,
    setSignND13Success,
    setActiveKeyNd13,
    isChangeImage,
    isDisableSync,
    isClickCheckInfo,
    setIsClickCheckInfo,
    interval,
    contractUploadType,
    listErr,
  } = useCensorshipStore();
  const isLoadingGenContract = !!useIsMutating({
    mutationKey: [queryKeyGenContract],
  });
  const isDisableCheck = form.getFieldValue('isDisableCheck');
  useEffect(() => {
    if (cardFront && cardBack && portrait) {
      mutateActivateInfo({
        files: { cardFront, cardBack, portrait },
        data: { isdn: isdnInfo, serial: serialSimInfo },
      });
    }
  }, [cardFront, cardBack, portrait]);

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

    setFormAntd(form);
    return () => {
      resetGroupStore();
    };
  }, []);

  const { data: subDocDetail, isPending: loadingSubDoc } = useViewSubDoc(
    id || ''
  );
  const { mutate: editSubDoc, isPending: loadingEdit } =
    useEditSubDoc(setIsShowSignLink);
  const { mutate: acceptReq, isPending: loadingAccept } = useAcceptRequest();
  const { mutate: synchronize, isPending: loadingSynchronize } =
    useSynchronize();
  const handleClickEdit = () => {
    navigate(pathRoutes.verification_approve_edit(id));
  };
  const handleClose = () => {
    navigate(-1);
    resetGroupStore();
    if (interval) {
      clearInterval(interval);
    }
  };
  onMessageListener()
    .then((payload: any) => {
      form.setFieldsValue({
        fileND13: 'Biên_bản_xác_nhận_NĐ13',
      });
      form.validateFields(['fileND13']);
      setSignND13Success(true);
      setActiveKeyNd13('');
      setIsSignSuccess(true);
      setIsDisabledContract(true);
    })
    .catch((err) => console.log('failed: ', err));
  useEffect(() => {
    if (subDocDetail) {
      setSubDocDetail(subDocDetail);
      setIsForbidden(subDocDetail.actionAllow === 0);
    }
  }, [subDocDetail]);
  const trackedFields: string[] = [
    'name',
    'document',
    'id',
    'issue_by',
    'issue_date',
    'birthday',
    'sex',
    'address',
    'city',
    'district',
    'ward',
    'expiry',
    'idExpireDateNote',
  ];
  const handleValuesChange = (changedValues: Record<string, any>) => {
    const fieldName = Object.keys(changedValues)[0];
    if (trackedFields.includes(fieldName)) {
      setIsClickCheckInfo(false);
      form.setFieldsValue({
        isDisableCheck: false,
      });
    }
  };
  const handleFinish = (values: any) => {
    const expiryDate = form.getFieldValue('expiry');
    const isError = dayjs().isAfter(dayjs(expiryDate, formatDate));
    const contractUrl =
      subDocDetail?.subDocumentImageResponses.find(
        (item) => item.imageCode === null && item.imageType === '2'
      )?.imagePath || '';
    const isOnlineContract = contractUrl.toLowerCase().endsWith('.pdf');
    const isChangeName = subDocDetail?.name !== form.getFieldValue('name');
    if (expiryDate && isError) {
      form.setFields([
        {
          name: 'expiry',
          errors: [
            'Thời gian lưu hồ sơ phải nhỏ hơn hoặc bằng Thời gian hết hạn giấy tờ',
          ],
        },
      ]);
      return;
    }
    if (!isError) {
      form.setFields([
        {
          name: 'expiry',
          errors: [],
        },
      ]);
    }
    if (!isClickCheckInfo && !isDisableCheck) {
      NotificationWarning('Vui lòng thực hiện kiểm tra thông tin');
      return;
    }
    if (!isDisableCheck) {
      return;
    }
    if (
      form.getFieldValue('contractUploadType') === TypeContractUpload.OFFLINE &&
      !isSignSuccess
    ) {
      NotificationWarning('Vui lòng kí lại hợp đồng để  lưu thông tin');
      setIsShowSignLink(true);
      return;
    }
    const cardFront = form.getFieldValue('cardFront');
    const cardBack = form.getFieldValue('cardBack');
    const portrait = form.getFieldValue('portrait');
    if (cardFront && !cardBack && !portrait) {
      NotificationError('Vui lòng upload đủ ảnh GTTT mặt sau và ảnh chân dung');
      return;
    } else if (cardFront && cardBack && !portrait) {
      NotificationError('Vui lòng upload đủ ảnh chân dung');
      return;
    }
    ModalConfirm({
      message: MESSAGE.G04,
      handleConfirm() {
        if (
          isSignSuccess ||
          (!isChangeImage && isOnlineContract && !isChangeName)
        ) {
          editSubDoc({
            files: {
              front: cardFront,
              back: cardBack,
              portrait: portrait,
              contract: cardContract,
              decree13: decree13,
            },
            form: {
              ...values,
              contractNo: subDocDetail?.contractNo,
            },
            id: subDocDetail?.subDocumentId,
            idEkyc: dataActivateInfo.id_ekyc,
            contractUploadType: Number(contractUploadType),
          });
        } else if (isChangeImage || isChangeName) {
          NotificationWarning(
            'Bạn đã sửa các thông tin có trong hợp đồng/ biểu mẫu.Vui lòng kí lại hợp đồng để lưu thông tin'
          );
          setIsShowSignLink(true);
        } else if (!isOnlineContract) {
          NotificationWarning('Vui lòng kí lại hợp đồng để lưu thông tin');
          setIsShowSignLink(true);
        } else {
          setIsShowSignLink(false);
        }
      },
    });
  };
  const handleConfirm = () => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn xác nhận yêu cầu kiểm duyệt này?',
      handleConfirm() {
        acceptReq(subDocDetail?.subDocumentId + '' || '');
      },
    });
  };
  const handleSynchronize = () => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn đồng bộ thông tin không?',
      handleConfirm() {
        if (subDocDetail) {
          synchronize({
            isdn: subDocDetail.phoneNumber + '',
            serialSim: subDocDetail.serialSim,
            subDocumentId: subDocDetail.subDocumentId,
          });
        }
      },
    });
  };
  return (
    <>
      <TitleHeader>
        {renderTitle()}{' '}
        {isForbidden && (
          <p className="text-[#ef4444] text-base inline">
            (Số thuê bao đang bị cấm tác động)
          </p>
        )}
      </TitleHeader>
      <BodyPage>
        <Spin
          spinning={
            loadingSubDoc || isLoadingActivateInfo || isLoadingGenContract
          }
        >
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            labelWrap={true}
            scrollToFirstError={true}
            onFinish={handleFinish}
            onValuesChange={handleValuesChange}
          >
            <Row gutter={10}>
              <CustomerInfo subDocDetail={subDocDetail} />
              <FormCheckND13 />
              <ActivateInfo
                isEditing={typeModal === ActionType.EDIT}
                subDocDetail={subDocDetail}
                isView={typeModal === ActionType.VIEW}
              />
              <Status
                isEditing={typeModal === ActionType.EDIT}
                subDocDetail={subDocDetail}
              />
              {typeModal === ActionType.EDIT && isShowSignLink && (
                <SignitureFormat />
              )}
              {typeModal === ActionType.VIEW && (
                <Col span={24}>
                  <Flex justify="end" gap={16} className="mt-8">
                    {includes(
                      actionByRole,
                      ActionsTypeEnum.SYNC_INFORMATION
                    ) && (
                      <CButton
                        disabled={
                          listErr.length > 0 || isDisableSync || isForbidden
                        }
                        onClick={handleSynchronize}
                        loading={loadingSynchronize}
                        icon={<FontAwesomeIcon icon={faRotate} />}
                      >
                        Đồng bộ thông tin
                      </CButton>
                    )}
                    {includes(actionByRole, ActionsTypeEnum.REQUEST_UPDATE) && (
                      <CButton
                        danger
                        onClick={() => setIsOpenReqModal(true)}
                        icon={<FontAwesomeIcon icon={faBullhorn} />}
                        disabled={isForbidden}
                      >
                        Yêu cầu cập nhật
                      </CButton>
                    )}
                    {includes(actionByRole, ActionsTypeEnum.CONFIRM) && (
                      <CButton
                        onClick={handleConfirm}
                        loading={loadingAccept}
                        icon={<FontAwesomeIcon icon={faCheck} />}
                        disabled={isForbidden || listErr.length > 0}
                      >
                        Xác nhận
                      </CButton>
                    )}
                    {(includes(actionByRole, ActionsTypeEnum.UPDATE) ||
                      includes(actionByRole, ActionsTypeEnum.UPDATE_FULL)) && (
                      <CButtonEdit
                        onClick={handleClickEdit}
                        disabled={isForbidden}
                      />
                    )}
                    <CButtonClose type="default" onClick={handleClose}>
                      Đóng
                    </CButtonClose>
                  </Flex>
                </Col>
              )}
              {typeModal === ActionType.EDIT && (
                <Col span={24}>
                  <Flex justify="center" gap={20} className="mt-8">
                    <CButtonSave htmlType="submit" loading={loadingEdit}>
                      Lưu
                    </CButtonSave>
                    <CButtonClose type="default" onClick={handleClose}>
                      Đóng
                    </CButtonClose>
                  </Flex>
                </Col>
              )}
            </Row>
          </Form>
        </Spin>
        <ModalRequestUpdate
          open={isOpenReqModal}
          setOpenModal={setIsOpenReqModal}
          phoneNumber={subDocDetail?.phoneNumber + ''}
          subDocumentId={subDocDetail?.subDocumentId}
        />
      </BodyPage>
    </>
  );
};
export default CensorshipRequest;
