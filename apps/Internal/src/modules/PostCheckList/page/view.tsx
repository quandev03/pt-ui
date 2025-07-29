import { CButtonClose } from '@react/commons/Button';
import {
  BodyPage,
  Button,
  CModalConfirm,
  TitlePage,
  WrapperPage,
} from '@react/commons/index';
import { BtnGroupFooter } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDateTime } from '@react/constants/moment';
import { getDate } from '@react/utils/datetime';
import { Col, Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormCheckND13 from '../../VerificationList/components/DocumentUpdateHistory/FormCheckND13';
import ActivateInfo from '../components/ActivateInfo';
import CustomerInfo from '../components/CustomerInfo';
import { ModalHistory } from '../components/ModalHistory';
import { ModalSelectedUserReview } from '../components/ModalSelectedUserReview';
import StatusInfo from '../components/StatusInfo';
import { useDetailPostCheckList } from '../hooks/useDetailPostCheckList';
import useGetCompareHistory from '../hooks/useGetCompareHistory';
import { useGetConfirmAuditSub } from '../hooks/useGetConfirmAuditSub';
import useStorePostCheckList from '../store';

const PostCheckListPage = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const {
    isHiddenModalHistory,
    setSubDocumentHistoryDTOS,
    idHistory,
    setIsHiddenModelSelectedReview,
    isHiddenModelSelectedReview,
  } = useStorePostCheckList();
  const { id } = useParams();
  const actions = useRolesByRouter();
  const [auditNote, setAuditNote] = useState<string>('');
  const { isPending: isLoadingConfirmAudit, mutate: confirmAuditMutate } =
    useGetConfirmAuditSub();
  const { isLoading, data } = useDetailPostCheckList(id ?? '');
  console.log('data', data);
  const { data: dataCompareHistory, isLoading: loadingCompareHistory } =
    useGetCompareHistory(idHistory ?? '', id ?? '');
  const { data: pdfBlobData } = useGetImage(data?.regulation13 ?? '');
  const { data: approvalStatusData } = useParameterQuery({
    'table-name': 'SUB_DOCUMENT',
    'column-name': 'APPROVAL_STATUS',
  });
  const { data: auditStatusData } = useParameterQuery({
    'table-name': 'SUB_DOCUMENT',
    'column-name': 'AUDIT_STATUS',
  });
  const handleFinish = () => {
    const auditNote = form.getFieldValue('approveAuditNote');
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn xác nhận hồ sơ này?',
      onOk: () => confirmAuditMutate({ id: id ?? '', auditNote }),
    });
  };
  const { data: dataReason } = useReasonCustomerService('AUDIT_REJECT', true);
  const listReason = useMemo(() => {
    if (!dataReason) return [];
    return dataReason?.map((item) => ({
      label: item.name,
      value: item.code,
    }));
  }, [dataReason]);
  useEffect(() => {
    if (data) {
      setSubDocumentHistoryDTOS(data.subDocumentHistoryDTOS);
      const formattedData = {
        ...data,
        idIssueDate: getDate(data.idIssueDate),
        birthDate: getDate(data.birthDate),
        idIssueDateExpire: getDate(data.idIssueDateExpire),
        expireDateNote: data.expireDateNote,
        otpStatus: data.otpStatus === 1 ? 'Đã xác thực' : 'Chưa xác thực',
        videoCallStatus:
          data.videoCallStatus === 1 ? 'Đã xác thực' : 'Chưa xác thực',
        approveDate: data.approveDate
          ? dayjs(data.approveDate).format(formatDateTime)
          : '',
        approveStatus: approvalStatusData?.find(
          (item) => Number(item.value) === data.approveStatus
        )?.label,
        auditStatus: auditStatusData?.find(
          (item) => Number(item.value) === data.auditStatus
        )?.label,
        auditRejectCode: listReason.find(
          (item) => item.value === data.auditRejectCode
        )?.label,
      };
      form.setFieldsValue(formattedData);
    }
  }, [data, approvalStatusData, auditStatusData, listReason]);

  return (
    <WrapperPage>
      <TitlePage>
        <Space>
          Thông tin khách hàng
          {!isLoading && data?.actionAllow !== 1 && (
            <span className="text-red-500 text-base">
              (Số thuê bao đang bị cấm tác động)
            </span>
          )}
        </Space>
      </TitlePage>
      <BodyPage>
        <Form
          disabled={true}
          form={form}
          colon={false}
          layout="horizontal"
          labelCol={{ prefixCls: 'subscription--form-label' }}
        >
          <Row gutter={16}>
            <CustomerInfo />
            <FormCheckND13 pdfBlobUrl={pdfBlobData} />
            <ActivateInfo />
            <StatusInfo
              approvalStatus={data?.approveStatus ?? undefined}
              auditStatus={data?.auditStatus ?? undefined}
            />
            <Col className="mt-8" span={24}>
              <BtnGroupFooter style={{ justifyContent: 'center' }}>
                {actions.includes(ActionsTypeEnum.RE_CENSOR) && (
                  <Button
                    disabled={
                      data?.auditStatus !== 0 || data?.actionAllow !== 1
                    }
                    className="w-[8.5rem]"
                    onClick={() => {
                      setIsHiddenModelSelectedReview(true);
                      // setAuditNote(form.getFieldValue('approveNote'));
                    }}
                  >
                    Kiểm duyệt lại
                  </Button>
                )}
                {actions.includes(ActionsTypeEnum.CONFIRM) && (
                  <Button
                    disabled={
                      data?.auditStatus !== 0 ||
                      data?.actionAllow !== 1 ||
                      !!data?.violationCriteria?.length
                    }
                    className="w-[8.5rem]"
                    onClick={handleFinish}
                    loading={isLoadingConfirmAudit}
                  >
                    Xác nhận
                  </Button>
                )}
                <CButtonClose onClick={() => navigate(-1)} disabled={false} />
              </BtnGroupFooter>
            </Col>
          </Row>
        </Form>
      </BodyPage>
      <ModalHistory
        data={dataCompareHistory as any}
        loading={loadingCompareHistory}
        open={isHiddenModalHistory}
      />
      <ModalSelectedUserReview
        open={isHiddenModelSelectedReview}
        auditNote={auditNote}
      />
    </WrapperPage>
  );
};
export default PostCheckListPage;
