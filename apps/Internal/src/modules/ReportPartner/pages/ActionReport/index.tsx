import {
  CButtonClose,
  CDatePicker,
  CInput,
  CTable,
  TitleHeader,
} from '@vissoft-react/common';
import { Col, Form, Row, Spin } from 'antd';
import { memo } from 'react';
import { useLogicActionReport } from './useLogicActionReport';

export const ActionReport = memo(() => {
  const { form, loadingGetReport, handleClose, Title, reportDetail, columns } =
    useLogicActionReport();

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetReport}>
        <Form
          form={form}
          labelCol={{ span: 5 }}
          labelWrap={true}
          validateTrigger={['onSubmit']}
          colon={false}
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <div className="pb-4 text-lg font-bold">Thông tin đơn hàng</div>
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item label="Mã đơn hàng" name="orderCode">
                  <CInput maxLength={100} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Thời gian đặt hàng" name="orderDate">
                  <CDatePicker
                    disabled={true}
                    format="DD/MM/YYYY"
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tổng tiền gói cước" name="packageFee">
                  <CInput onlyNumber maxLength={100} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số lượng eSIM" name="eSIMCount">
                  <CInput maxLength={10} disabled={true} onlyNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tên đối tác" name="partnerName">
                  <CInput maxLength={100} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Loại dịch vụ" name="serviceType">
                  <CInput maxLength={100} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Người đặt hàng" name="ordererName">
                  <CInput maxLength={100} disabled={true} />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8 mt-4">
            <div className="pb-4 text-lg font-bold">Danh sách sản phẩm</div>

            <Row gutter={[30, 0]}>
              <CTable
                columns={columns}
                dataSource={reportDetail?.listProduct ?? []}
                loading={loadingGetReport}
                rowKey="id"
                // pagination={{
                //   total: reportDetail?.listProduct.length,
                // }}
                scroll={{ x: 'max-content' }}
              />
            </Row>
          </div>
          <div className="flex flex-wrap justify-end gap-4 mt-7">
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
});
