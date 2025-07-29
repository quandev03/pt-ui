import CDatePicker from '@react/commons/DatePicker';
import { CSelect } from '@react/commons/index';
import CInput from '@react/commons/Input';
import { formatDateTime } from '@react/constants/moment';
import { Col, Form, Row } from 'antd';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useApproveStatusList } from '../../hooks/useApproveStatusList';

const StatusDoc = () => {
  const { data: auditSttOpts, isPending: loadingAuditStatus } =
    useApproveStatusList('AUDIT_STATUS');
  const { data: approveReasonOptions, isPending: loadingReason } =
    useReasonCustomerService('REASON_APPROVE');

  return (
    <fieldset>
      <legend>Trạng thái</legend>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item label="Lý do kiểm duyệt" name="approveRejectReasonCode">
            <CSelect
              disabled={true}
              options={approveReasonOptions}
              loading={loadingReason}
              fieldNames={{ label: 'name', value: 'code' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ghi chú kiểm duyệt" name={'approvalNote'}>
            <CInput disabled={true} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="User kiểm duyệt" name="assignUser">
            <CInput disabled={true} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Thời gian kiểm duyệt" name="approvalDate">
            <CDatePicker disabled={true} format={formatDateTime} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Trạng thái hậu kiểm" name="auditStatus">
            <CSelect
              disabled={true}
              options={auditSttOpts}
              loading={loadingAuditStatus}
            />
          </Form.Item>
        </Col>
      </Row>
    </fieldset>
  );
};
export default StatusDoc;
