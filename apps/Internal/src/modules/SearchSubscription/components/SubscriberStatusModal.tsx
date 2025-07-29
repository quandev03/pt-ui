import { Col, Form, Row } from 'antd';
import { ModalProps } from '../types';
import { CInput, CModal, CNumberInput } from '@react/commons/index';
import { CButtonClose } from '@react/commons/Button';
import { useParams } from 'react-router-dom';
import { useSubscriberStatusQuery } from '../hooks/useSubscriberStatusQuery';
import { useEffect } from 'react';

const mapCurrentStatus = (status: string) => {
  switch (status) {
    case 'CREATED':
      return 'Đã khởi tạo chưa có thông tin';
    case 'VALID':
      return 'Đã có thông tin thuê bao và chờ kích hoạt';
    case 'ACTIF':
      return 'Đang hoạt động';
    case 'INACT':
      return 'Đang bị khóa';
    case 'DEACT':
      return 'Chờ xóa';
    default:
      return '';
  }
};

const SubscriberStatusModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const { isFetching, data } = useSubscriberStatusQuery(id ?? '', isOpen);

  useEffect(() => {
    if (isOpen && data) {
      form.setFieldsValue({
        ...data,
        activeStatusTwoWay: data.activeStatusTwoWay === '1' ? 'Có' : 'Không',
        aLock: data.aLock === '1' ? 'Đang bị khóa tác động' : 'Bình thường',
        firstCal: data.firstCal === '1' ? 'Đã thực hiện' : undefined,
        allowP2P: data.allowP2P === '1' ? 'Được phép' : 'Đang chặn',
        aCurSta: mapCurrentStatus(data.aCurSta),
        langCur: data.langCur === '1' ? 'Tiếng Anh' : 'Tiếng Việt',
      });
    }
  }, [isOpen, data]);

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      width={1200}
      title="Xem trạng thái hiện tại của thuê bao"
      footer={[<CButtonClose onClick={handleCancel} />]}
      onCancel={handleCancel}
      loading={isFetching}
    >
      <Form form={form} labelCol={{ span: 8 }} colon={false} labelWrap disabled>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Số thuê bao" name="msisdn">
              <CInput />
            </Form.Item>
            <Form.Item label="IMSI" name="imsi">
              <CInput />
            </Form.Item>
            <Form.Item label="Loại thuê bao" name="profile">
              <CInput />
            </Form.Item>
            <Form.Item label="Trạng thái thuê bao" name="aCurSta">
              <CInput />
            </Form.Item>
            <Form.Item label="Số tiền trong tài khoản chính" name="credit">
              <CNumberInput disabled allowNegative />
            </Form.Item>
            <Form.Item label="Ngôn ngữ thuê bao" name="langCur">
              <CInput />
            </Form.Item>
            <Form.Item
              label="Trạng thái phát sinh cuộc gọi đầu tiên"
              name="firstCal"
            >
              <CInput />
            </Form.Item>
            <Form.Item label="Ngày kích hoạt" name="dTac">
              <CInput />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Trạng thái chặn 2 chiều"
              name="activeStatusTwoWay"
            >
              <CInput />
            </Form.Item>
            <Form.Item label="Ngày chặn 1 chiều" name="dTmc">
              <CInput />
            </Form.Item>
            <Form.Item label="Ngày chặn 2 chiều" name="dTin">
              <CInput />
            </Form.Item>
            <Form.Item label="Ngày thu hồi số" name="dTr">
              <CInput />
            </Form.Item>
            <Form.Item label="Trạng thái khóa trên OCS" name="aLock">
              <CInput />
            </Form.Item>
            <Form.Item label="Cho phép P2P" name="allowP2P">
              <CInput />
            </Form.Item>
            <Form.Item label="Thông tin Zone" name="cityLoc">
              <CInput />
            </Form.Item>
            <Form.Item label="Ngày nạp tiền gần nhất" name="lstReldt">
              <CInput />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CModal>
  );
};

export default SubscriberStatusModal;
