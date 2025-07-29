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
import { AnyElement } from '@react/commons/types';
import {
  ActionsTypeEnum,
  ActionType,
  DateFormat,
  IDType,
} from '@react/constants/app';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { Col, Flex, Form, Row, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { requestFcmToken } from 'apps/Internal/src/service/firebase';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApproveSubdocument } from '../../hooks/useApproveSubdocument';
import { useCheckCondition } from '../../hooks/useCheckCondition';
import { useDetailUpdateSubdocument } from '../../hooks/useDetailUpdateSubdocument';
import { useSynchronize } from '../../hooks/useSynchronize';
import { useUpdateDetailHistorySubdocument } from '../../hooks/useUpdateDetailHistorySubdocument';
import useCensorshipStore from '../../store';
import { IPayloadConfirm } from '../../types';
import CustomerInfo from '../CustomerInfo';
import CustomerInfoDoc from './CustomerInfoDoc';
import { ModalRequestUpdate } from './ModalRequestUpdate';
import SignitureFormat from './SignitureFormat';
import StatusDoc from './StatusDoc';

type Props = {
  typeModal: ActionType;
};
const DocumentUpdateHistory: React.FC<Props> = ({ typeModal }) => {
  const {
    isDisableSync,
    isUpdateCustomerInfoDoc,
    isCheckConditionSuccess,
    isUpdateFieldNeedSignAgain,
    setSubDocDetail,
    setFormAntd,
    setDeviceToken,
    resetGroupStore,
    formAntd,
    isSignSuccess,
    contractUploadType,
    setCheckConditionErrors,
  } = useCensorshipStore();
  const listRoles = useRolesByRouter();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      scrollToError();
    }, 0);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    requestFcmToken()
      .then((currentToken) => {
        if (currentToken) {
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

  const [isOpenRequestUpdate, setOpenRequestUpdate] = useState(false);

  const { data: dataSubdocument, isPending } = useDetailUpdateSubdocument(id);
  useEffect(() => {
    if (dataSubdocument) {
      setSubDocDetail(dataSubdocument as AnyElement);
    }
  }, [dataSubdocument]);
  const { isPending: isLoadingEdit, mutate: editMutate } =
    useUpdateDetailHistorySubdocument(form);
  const { data: pdfBlobUrlNew } = useGetImage(
    dataSubdocument?.newData.imageList.find((item) => item.imageType === '3')
      ?.imagePath || ''
  );
  const { data: pdfBlobUrl } = useGetImage(
    dataSubdocument?.oldData.imageList.find((item) => item.imageType === '3')
      ?.imagePath || ''
  );
  const { mutate: synchronize, isPending: loadingSynchronize } =
    useSynchronize();

  const { isPending: isLoadingApprove, mutate: approveSubdocumentMutate } =
    useApproveSubdocument();
  const handleClickEdit = () => {
    navigate(pathRoutes.censorship_history_edit(id));
  };
  // update cap nhat giay to
  const {
    mutate: checkCondition,
    error: errorCheckCondition,
    reset: resetStateCheckCondition,
    isSuccess: isSuccessCheckCondition,
  } = useCheckCondition(
    (errorField) => {
      console.log('🚀 ~ errorField:', errorField);
      setCheckConditionErrors(errorField);
    },
    () => {
      setCheckConditionErrors([]);
    },
    true
  );
  useEffect(() => {
    if (dataSubdocument) {
      const { newData } = dataSubdocument;
      const data = {
        address: newData.address,
        birthday: newData.birthDate
          ? dayjs(newData.birthDate).format(formatDateEnglishV2)
          : '',
        city: newData.province,
        district: newData.district,
        document: newData.idType,
        expiry: newData.idIssueDate
          ? dayjs(newData.idIssueDate).format(formatDateEnglishV2)
          : '',
        id: newData.idNo,
        id_ekyc: newData.idIssuePlace,
        issue_by: newData.idIssuePlace,
        issue_date: newData.idIssueDate
          ? dayjs(newData.idIssueDate).format(formatDateEnglishV2)
          : '',
        name: newData.name,
        sex: newData.sex,
        ward: newData.precinct,
        idExpiryDateNote: newData.idIssueDateNote
          ? dayjs(newData.idIssueDateNote).format(formatDateEnglishV2)
          : '',
      };
      if (newData.idType === IDType.CMND) {
        NotificationError(
          'Từ ngày 01/01/2025 không thể thêm mới với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
        );
        return;
      }
      checkCondition(data);
    }
  }, [dataSubdocument]);
  // update cap nhat giay to
  const handleSynchronize = () => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn đồng bộ thông tin không?',
      handleConfirm() {
        synchronize({
          isdn: dataSubdocument?.isdn || '',
          serialSim: dataSubdocument?.serialSim || '',
          subDocumentId: id || '',
        });
      },
    });
  };
  const scrollToError = () => {
    let elementError = document.querySelector('.ant-input-status-error');
    if (!elementError) {
      elementError = document.querySelector('.ant-select-status-error');
    }
    if (!elementError) {
      elementError = document.querySelector('.ant-picker-status-error');
    }
    if (!elementError) {
      elementError = document.querySelector('.ant-input-number-status-error');
    }
    if (elementError) {
      elementError.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const isNotNeedCheckCondition = useMemo(() => {
    return includes(listRoles, ActionsTypeEnum.UPDATE_FULL);
  }, [listRoles]);

  const handleEditForm = () => {
    if (
      isUpdateCustomerInfoDoc &&
      !isCheckConditionSuccess &&
      isNotNeedCheckCondition
    ) {
      NotificationWarning('Vui lòng thực hiện kiểm tra thông tin');
      return;
    }
    if (
      isUpdateCustomerInfoDoc &&
      isUpdateFieldNeedSignAgain &&
      isCheckConditionSuccess &&
      !isSignSuccess &&
      isNotNeedCheckCondition
    ) {
      NotificationWarning('Vui lòng ký lại hợp đồng để lưu thông tin');
      return;
    }
    const keyMap = 'new';
    form
      .validateFields([
        [keyMap, 'idType'],
        [keyMap, 'name'],
        [keyMap, 'idNo'],
        [keyMap, 'idIssuePlace'],
        [keyMap, 'idIssueDate'],
        [keyMap, 'idIssueDateExpire'],
        [keyMap, 'birthDate'],
        [keyMap, 'sex'],
        [keyMap, 'address'],
        [keyMap, 'province'],
        [keyMap, 'district'],
        [keyMap, 'precinct'],
        [keyMap, 'idExpiryDateNote'],
      ])
      .then((value) => {
        const newData = value.new;
        const data = {
          id: id ?? '',
          name: newData.name,
          birthDate: dayjs(newData.birthDate).format(DateFormat.DEFAULT),
          sex: newData.sex,
          address: newData.address,
          province: newData.province,
          district: newData.district,
          precinct: newData.precinct,
          idNo: newData.idNo,
          idType: newData.idType,
          idIssueDate: dayjs(newData.idIssueDate).format(DateFormat.DEFAULT),
          idIssuePlace: newData.idIssuePlace,
          idIssueDateExpire: dayjs(newData.idIssueDateExpire).format(
            DateFormat.DEFAULT
          ),
          contractNo: dataSubdocument?.newData.contractNo,
          idExpiryDateNote: newData.idExpiryDateNote,
          contractUploadType: Number(
            dataSubdocument?.newData.uploadContractType
          ),
          customerCode: dataSubdocument?.newData.customerCode ?? '',
          providerAreaCode: dataSubdocument?.newData.ccdvvt ?? '',
          nationality: 'Việt Nam',
          uploadContractTime: dataSubdocument?.newData.uploadContractDate ?? '',
          contractResignTime: dataSubdocument?.newData.contractResignTime ?? '',
          empId: dataSubdocument?.newData.empId ?? '',
          empName: dataSubdocument?.newData.empName ?? '',
          idExpireDate: newData.idExpireDate ?? '',
        };
        ModalConfirm({
          message: 'common.confirmUpdate',
          handleConfirm: () => {
            editMutate(data as IPayloadConfirm);
          },
        });
      })
      .catch((err) => {
        timeoutRef.current = setTimeout(() => {
          scrollToError();
        }, 0);
      });
  };
  const handleConfirm = () => {
    const newData = dataSubdocument?.newData;
    const data: IPayloadConfirm = {
      id: id ?? '',
      name: newData?.name ?? '',
      birthDate: dayjs(newData?.birthDate).format(DateFormat.DEFAULT) ?? '',
      sex: newData?.sex ?? '',
      address: newData?.address ?? '',
      province: newData?.province ?? '',
      district: newData?.district ?? '',
      precinct: newData?.precinct ?? '',
      idNo: newData?.idNo ?? '',
      idType: newData?.idType ?? '',
      idIssueDate: dayjs(newData?.idIssueDate).format(DateFormat.DEFAULT) ?? '',
      idIssuePlace: newData?.idIssuePlace ?? '',
      idIssueDateExpire:
        dayjs(formAntd.getFieldValue('new')['idIssueDateExpire']).format(
          DateFormat.DEFAULT
        ) ?? '',
      contractNo: newData?.contractNo ?? '',
      contractUploadType: Number(newData?.uploadContractType) ?? '',
      customerCode: newData?.customerCode ?? '',
      providerAreaCode: newData?.ccdvvt ?? '',
      nationality: 'Việt Nam',
      uploadContractTime: newData?.uploadContractDate ?? '',
      contractResignTime: newData?.contractResignTime ?? '',
      empId: newData?.empId ?? '',
      empName: newData?.empName ?? '',
      idExpireDate: newData?.idExpireDate ?? '',
    };
    approveSubdocumentMutate(data);
  };

  useEffect(() => {
    if (dataSubdocument) {
      form.setFieldsValue({
        approveRejectReasonCode: dataSubdocument.approvalRejectReasonCode,
        assignUser: dataSubdocument.assignUser,
        approvalDate: dataSubdocument?.approvalDate
          ? dayjs(dataSubdocument?.approvalDate)
          : undefined,
        approvalTime: dataSubdocument.approvalTime,
        approvalNote: dataSubdocument.approvalNote,
        auditStatus: dataSubdocument.auditStatus,
      });
    }
  }, [dataSubdocument]);

  const title = useMemo(() => {
    if (typeModal === ActionType.VIEW) {
      return 'Chi tiết cập nhật giấy tờ';
    }
    return 'Chỉnh sửa cập nhật giấy tờ';
  }, [typeModal]);

  return (
    <>
      <TitleHeader>{title}</TitleHeader>
      <BodyPage>
        <Spin spinning={isPending}>
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelWrap={true}
            scrollToFirstError={true}
          >
            <Row gutter={16}>
              <CustomerInfo subDocDetail={dataSubdocument as any} />
              <Col span={24} className="mt-3 !px-0">
                <Row gutter={30}>
                  <Col span={12}>
                    <CustomerInfoDoc
                      isOld={true}
                      dataApproveDoc={dataSubdocument?.oldData}
                      pdfBlobUrl={pdfBlobUrl as string}
                      typeModal={typeModal}
                    />
                  </Col>
                  <Col span={12}>
                    <CustomerInfoDoc
                      isOld={false}
                      dataApproveDoc={dataSubdocument?.newData}
                      pdfBlobUrl={pdfBlobUrlNew as string}
                      typeModal={typeModal}
                    />
                  </Col>
                </Row>
              </Col>
              <StatusDoc />
              {isCheckConditionSuccess && isUpdateFieldNeedSignAgain && (
                <SignitureFormat />
              )}
              {typeModal === ActionType.VIEW && (
                <Col span={24}>
                  <Flex justify="end" gap={12} className="mt-8">
                    <CButton
                      disabled={
                        dataSubdocument?.newData?.errorsList?.length > 0 ||
                        isDisableSync
                      }
                      loading={loadingSynchronize}
                      onClick={handleSynchronize}
                      icon={<FontAwesomeIcon icon={faRotate} />}
                    >
                      Đồng bộ thông tin
                    </CButton>
                    <CButton
                      danger
                      onClick={() => setOpenRequestUpdate(true)}
                      icon={<FontAwesomeIcon icon={faBullhorn} />}
                    >
                      Yêu cầu cập nhật
                    </CButton>
                    <CButton
                      loading={isLoadingApprove}
                      onClick={handleConfirm}
                      icon={<FontAwesomeIcon icon={faCheck} />}
                    >
                      Xác nhận
                    </CButton>
                    <CButtonEdit onClick={handleClickEdit} />
                    <CButtonClose onClick={() => navigate(-1)} />
                  </Flex>
                </Col>
              )}
              {typeModal === ActionType.EDIT && (
                <Col span={24}>
                  <Flex justify="end" gap={12} className="mt-3">
                    <CButtonSave
                      onClick={handleEditForm}
                      loading={isLoadingEdit}
                    />
                    <CButtonClose onClick={() => navigate(-1)} />
                  </Flex>
                </Col>
              )}
            </Row>
          </Form>
        </Spin>
        {isOpenRequestUpdate && (
          <ModalRequestUpdate
            phoneNumber={dataSubdocument?.isdn}
            open={isOpenRequestUpdate}
            setOpenModal={setOpenRequestUpdate}
            subDocumentId={id}
          />
        )}
      </BodyPage>
    </>
  );
};
export default DocumentUpdateHistory;
