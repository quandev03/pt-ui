import {
  CButtonClose,
  TitleHeader,
  RenderCell,
} from '@vissoft-react/common';
import { Col, Row, Table, Spin, Tag, Button } from 'antd';
import { memo } from 'react';
import { useLogicRoomPaymentDetail } from './useLogicRoomPaymentDetail';
import { ColumnsType } from 'antd/es/table';
import { IRoomPaymentDetail, PaymentStatus } from '../../types';
import { PaymentStatusMap } from '../../constants/enum';
import { useGetAgencyOptions } from '../../../../hooks/useGetAgencyOptions';

export const RoomPaymentDetail = memo(() => {
  const {
    paymentDetail,
    loadingDetail,
    handleClose,
    handlePrintInvoice,
    handleResendEmail,
  } = useLogicRoomPaymentDetail();

  const { data: agencyOptions = [] } = useGetAgencyOptions();

  const findRoomName = (orgUnitId: string): string => {
    const findInTree = (nodes: any[]): string | null => {
      for (const node of nodes) {
        if (node.value === orgUnitId) {
          return node.title;
        }
        if (node.children) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(agencyOptions) || '-';
  };

  const detailColumns: ColumnsType<IRoomPaymentDetail> = [
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 200,
      align: 'left',
    },
    {
      title: 'SL',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
      render: (value) => <RenderCell value={value} tooltip={value} />,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 150,
      align: 'right',
      render: (value) => {
        const formatted = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value || 0);
        return <RenderCell value={formatted} tooltip={formatted} />;
      },
    },
    {
      title: 'Thành tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right',
      render: (value) => {
        const formatted = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value || 0);
        return <RenderCell value={formatted} tooltip={formatted} />;
      },
    },
  ];

  if (loadingDetail) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!paymentDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Không tìm thấy thông tin thanh toán</p>
        <CButtonClose onClick={handleClose} className="mt-4" />
      </div>
    );
  }

  const roomName = paymentDetail.orgUnitName || findRoomName(paymentDetail.orgUnitId);

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>
        Chi tiết thanh toán - Phòng {roomName} - {paymentDetail.month}/{paymentDetail.year}
      </TitleHeader>

      <div className="bg-white rounded-[10px] px-6 pt-4 pb-8 mt-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <span className="font-medium">Mã phòng: </span>
                <span>{roomName}</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Tháng/Năm: </span>
                <span>
                  {paymentDetail.month}/{paymentDetail.year}
                </span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Tổng tiền: </span>
                <span className="text-lg font-bold text-blue-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(paymentDetail.totalAmount)}
                </span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Trạng thái: </span>
                <Tag
                  color={
                    paymentDetail.status === PaymentStatus.PAID ? 'green' : 'orange'
                  }
                  bordered={false}
                >
                  {PaymentStatusMap[paymentDetail.status as PaymentStatus]}
                </Tag>
              </div>
            </Col>
          </Row>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Chi tiết dịch vụ</h3>
          <Table
            columns={detailColumns}
            dataSource={paymentDetail.details}
            rowKey="id"
            pagination={false}
            bordered
          />
        </div>

        {paymentDetail.qrCodeUrl && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Mã QR thanh toán</h3>
            <div className="flex justify-center">
              <img
                src={paymentDetail.qrCodeUrl}
                alt="QR Code"
                className="border border-gray-300 rounded p-2"
                style={{ maxWidth: '300px', maxHeight: '300px' }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-end mt-6">
          <Button onClick={handlePrintInvoice}>In hóa đơn</Button>
          <Button onClick={handleResendEmail}>Gửi lại email</Button>
          <CButtonClose onClick={handleClose} />
        </div>
      </div>
    </div>
  );
});

