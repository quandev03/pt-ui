import { CDatePicker, CInput, CModal, CTable } from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { memo } from 'react';
import { useLogicActioneSIMStock } from './useLogicActioneSIMStock';

interface Props {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

export const ActioneSIMStock = memo(({ openModal, onClose, id }: Props) => {
  const { listeSIMDetail, loadingTable, columns, form } =
    useLogicActioneSIMStock(id);

  return (
    <CModal
      open={openModal}
      title="Xem chi tiết eSIM"
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{
        maxHeight: '80vh', // Giới hạn chiều cao modal
        overflowY: 'auto', // Scroll nội dung
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 5 }}
        labelWrap={true}
        validateTrigger={['onSubmit']}
        colon={false}
      >
        <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
          <div className="pb-4 text-lg font-bold">Thông tin khách hàng</div>
          <Row gutter={[30, 0]}>
            <Col span={12}>
              <Form.Item label="Mã hợp đồng" name="contractCode">
                <CInput maxLength={100} disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mã khách hàng" name="customerCode">
                <CInput maxLength={100} disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loại giấy tờ" name="typeDocument">
                <CInput maxLength={100} disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Họ và tên" name="fullName">
                <CInput maxLength={100} disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giới tính" name="gender">
                <CInput maxLength={100} disabled={true} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Ngày sinh" name="birthOfDate">
                <CDatePicker
                  disabled={true}
                  format="DD/MM/YYYY"
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số hộ chiếu" name="idNumber">
                <CInput maxLength={100} disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày cấp" name="issueDate">
                <CDatePicker
                  disabled={true}
                  format="DD/MM/YYYY"
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày hết hạn" name="idNoExpireDate">
                <CDatePicker
                  disabled={true}
                  format="DD/MM/YYYY"
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Quốc tịch" name="nationality">
                <CInput maxLength={100} disabled={true} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
      <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
        <div className="pb-4 text-lg font-bold">Thông tin eSIM</div>
        <CTable
          dataSource={listeSIMDetail}
          columns={columns}
          loading={loadingTable}
        />
      </div>
    </CModal>
  );
});
