import { CInput, CTextArea } from '@react/commons/index';
import Show from '@react/commons/Template/Show';
import { Col, Form, Row } from 'antd';
import { useMemo } from 'react';
import { ApprovalStatusValue, AuditStatusValue } from '../types';

const StatusInfo = ({
  approvalStatus,
  auditStatus,
}: {
  approvalStatus?: number;
  auditStatus?: number;
}) => {
  const checkHiddenAuditReject = useMemo(() => {
    if (
      (approvalStatus === ApprovalStatusValue.KiemDuyetLai &&
        auditStatus === AuditStatusValue.DaHauKiem) ||
      (approvalStatus === ApprovalStatusValue.YeuCauCapNhatGiayTo &&
        auditStatus === AuditStatusValue.ChuaHauKiem)
    ) {
      return true;
    }
    return false;
  }, [auditStatus]);
  console.log('checkHiddenAuditReject', checkHiddenAuditReject);
  return (
    <fieldset>
      <legend>Trạng thái</legend>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            labelCol={{
              style: { minWidth: '200px', whiteSpace: 'normal' },
              span: 6,
            }}
            label="Trạng thái xác thực OTP"
            name="otpStatus"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{
              style: { minWidth: '200px', whiteSpace: 'normal' },
              span: 6,
            }}
            label="Trạng thái xác thực Video call"
            name="videoCallStatus"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{
              style: { minWidth: '200px', whiteSpace: 'normal' },
              span: 6,
            }}
            label="User xác thực Video call"
            name="videoCallUser"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{
              style: { minWidth: '200px', whiteSpace: 'normal' },
              span: 6,
            }}
            label="User kiểm duyệt"
            name="approveUser"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{
              style: { minWidth: '200px', whiteSpace: 'normal' },
              span: 6,
            }}
            label="Số lần kiểm duyệt"
            name="approvalNumber"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{
              style: { minWidth: '200px', whiteSpace: 'normal' },
              span: 6,
            }}
            label="Ngày kiểm duyệt"
            name="approveDate"
          >
            <CInput placeholder="Ngày kiểm duyệt" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Trạng thái kiểm duyệt"
            labelCol={{
              style: { minWidth: '200px', whiteSpace: 'normal' },
              span: 6,
            }}
            name="approveStatus"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Show.When isTrue={checkHiddenAuditReject}>
          <Col span={12}>
            <Form.Item
              label="Lý do kiểm duyệt lại"
              labelCol={{
                style: { minWidth: '200px', whiteSpace: 'normal' },
                span: 6,
              }}
              name="auditRejectCode"
            >
              <CInput placeholder="Lý do kiểm duyệt lại" />
            </Form.Item>
          </Col>
        </Show.When>
        <Col span={12}>
          <Form.Item
            label="Trạng thái hậu kiểm"
            labelCol={{
              style: { minWidth: '200px', whiteSpace: 'normal' },
              span: 6,
            }}
            name="auditStatus"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{
              style: { minWidth: '200px', whiteSpace: 'normal' },
              span: 6,
            }}
            label="Ghi chú kiểm duyệt"
            name="approveNote"
          >
            <CTextArea placeholder="Ghi chú kiểm duyệt" rows={1} />
          </Form.Item>
        </Col>
      </Row>
    </fieldset>
  );
};

export default StatusInfo;
