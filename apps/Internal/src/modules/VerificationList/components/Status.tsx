import CDatePicker from '@react/commons/DatePicker';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTextArea from '@react/commons/TextArea';
import { formatDateTime } from '@react/constants/moment';
import { Col, Form, Row } from 'antd';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useApproveStatusList } from '../hooks/useApproveStatusList';
import { ISubDocument } from '../types';

type Props = {
  isEditing: boolean;
  subDocDetail: ISubDocument | undefined;
};
const Status: React.FC<Props> = ({ isEditing, subDocDetail }) => {
  const form = Form.useFormInstance();
  const { data: approveReasonOptions, isPending: loadingReason } =
    useReasonCustomerService('REASON_APPROVE');
  const { data: auditReasonOptions } = useReasonCustomerService('AUDIT_REJECT');
  useEffect(() => {
    if (subDocDetail) {
      const {
        approveStatus,
        auditStatus,
        otpStatus,
        videoCallStatus,
        approveDate,
        videoCallUser,
        assignUserName,
        approveNumber,
        approveRejectReasonCode,
        approveNote,
        auditRejectReasonCode,
      } = subDocDetail;
      form.setFieldsValue({
        approveStatus,
        auditStatus,
        otpStatus,
        videoCallStatus,
        approveDate: approveDate ? dayjs(approveDate) : undefined,
        videoCallUser: videoCallUser,
        assignUserName: assignUserName,
        approveNumber: approveNumber,
        approveRejectReasonCode: approveRejectReasonCode,
        approveNote: approveNote,
        auditRejectReasonCode: auditRejectReasonCode,
      });
    }
  }, [subDocDetail]);
  const verifyOpts = [
    { label: 'Chưa xác thực', value: 0 },
    { label: 'Đã xác thực', value: 1 },
  ];
  const { data: approvalSttOpts } = useApproveStatusList('APPROVAL_STATUS');
  const { data: auditSttOpts } = useApproveStatusList('AUDIT_STATUS');
  return (
    <fieldset>
      <legend>Trạng thái</legend>
      <Row gutter={[20, 0]} className="mt-3">
        <Col span={12}>
          <Form.Item label="Trạng thái xác thực OTP" name="otpStatus">
            <CSelect disabled={true} options={verifyOpts} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Trạng thái xác thực video call"
            name="videoCallStatus"
          >
            <CSelect disabled={true} options={verifyOpts} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="User xác thực video call" name="videoCallUser">
            <CInput disabled={true} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Trạng thái kiểm duyệt" name="approveStatus">
            <CSelect disabled={true} options={approvalSttOpts} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="User kiểm duyệt" name="assignUserName">
            <CInput disabled={true} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Số lần kiểm duyệt" name="approveNumber">
            <CInput disabled={true} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Lý do kiểm duyệt" name="approveRejectReasonCode">
            <CSelect
              disabled={true}
              options={approveReasonOptions}
              loading={loadingReason}
              fieldNames={{ label: 'name', value: 'code' }}
              placeholder={'Lý do kiểm duyệt'}
              filterOption={(input, options: any) =>
                (options?.name ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              showSearch
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Ghi chú kiểm duyệt" name="approveNote">
            <CTextArea disabled={true} maxLength={255} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Thời gian kiểm duyệt" name="approveDate">
            <CDatePicker disabled={true} format={formatDateTime} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Trạng thái hậu kiểm" name="auditStatus">
            <CSelect disabled={true} options={auditSttOpts} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Lý do hậu kiểm" name="auditRejectReasonCode">
            <CSelect
              disabled={true}
              options={auditReasonOptions}
              fieldNames={{ label: 'name', value: 'code' }}
            />
          </Form.Item>
        </Col>
      </Row>
    </fieldset>
  );
};
export default Status;
