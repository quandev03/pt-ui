import { Col, Collapse, Form, Row, Tooltip } from 'antd';
import validateForm from '@react/utils/validator';
import { Button, CInput } from '../../../../../../commons/src/lib/commons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faAnglesUp, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import useActiveSubscriptStore from '../store';

const ThongTinKichHoat = () => {
  const form = Form.useFormInstance()
  const { activeKeyStatus: activeKey, setActiveKeyStatus: setActiveKey } =
    useActiveSubscriptStore();

  const handleChangeCollapse = () => {
    setActiveKey(activeKey === '1' ? '' : '1');
  };

  return (
    <fieldset>
      <legend>
        <span>Trạng thái</span>
        <Button
          type="text"
          icon={
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={activeKey === '1' ? faAnglesUp : faAnglesDown}
              size="lg"
            />
          }
          title="Làm mới"
          onClick={handleChangeCollapse}
        />
      </legend>
      <Collapse activeKey={activeKey} ghost>
        <Collapse.Panel showArrow={false} header={''} key="1">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Trạng thái xác thực OTP"
                name="otpStatus"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="Trạng thái xác thực OTP"
                  maxLength={50}
                  suffix={
                    form.getFieldValue('otpReason') ? (
                    <Tooltip title={form.getFieldValue('otpReason')}>
                      <FontAwesomeIcon
                        className="text-red-500 text-lg"
                        icon={faExclamationCircle}
                      />
                    </Tooltip>
                  ) : null}
                />
              </Form.Item>
            </Col>
            <Col span={12} />
            <Col span={12}>
              <Form.Item
                label="Trạng thái xác thực Video call"
                name="videoCallStatus"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="Trạng thái xác thực Video call"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="User xác thực Video call"
                name="videoCallUser"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="User xác thực Video call"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái Kiểm duyệt"
                name="approveStatus"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="Trạng thái Kiểm duyệt"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="User kiểm duyệt"
                name="assignUserName"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="User kiểm duyệt"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lần kiểm duyệt"
                name="approveNumber"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="Số lần kiểm duyệt"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Lý do kiểm duyệt"
                name="approveReason"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="Lý do kiểm duyệt"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ghi chú kiểm duyệt"
                name="approveNote"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="Ghi chú kiểm duyệt"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thời gian kiểm duyệt"
                name="approveDate"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="Thời gian kiểm duyệt"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái hậu kiểm"
                name="auditStatus"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="Trạng thái hậu kiểm"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Lý do hậu kiểm"
                name="auditReason"
                labelCol={{ span: 8 }}
              >
                <CInput
                  disabled={true}
                  placeholder="Lý do hậu kiểm"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    </fieldset>
  );
};

export default ThongTinKichHoat;
