import { HomeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { CTable } from '@react/commons/index';
import { Text, TitleHeader } from '@react/commons/Template/style';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetShippingReportDetail } from '../hook/useGetShippingReportDetail';
import { Spin, Tooltip } from 'antd';
import { formatCurrencyVND } from '@react/helpers/utils';
import { CButtonClose } from '@react/commons/Button';

const ShippingReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    mutate: getShippingReportDetail,
    isPending: isLoadingDetail,
    data: dataDetail,
  } = useGetShippingReportDetail();

  useEffect(() => {
    if (id) {
      getShippingReportDetail(id);
    }
  }, [id]);

  return (
    <div>
      <TitleHeader>Xem chi tiết </TitleHeader>
      <Spin spinning={isLoadingDetail}>
        <div className="text-lg font-bold mb-6">
          Mã vận đơn : {dataDetail?.deliveryNo}
        </div>
        <div className="grid grid-cols-8 grid-rows-3 gap-4 gap-y-6">
          <div className="col-span-4 row-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <h2 className="bg-[#75A0E1] p-4 py-2 font-bold text-white rounded-t-lg">
                Thông tin địa chỉ
              </h2>
              <div className="p-4 flex gap-2">
                <div className="flex-1">
                  <p className="font-bold mb-3">Người gửi:</p>
                  <p className="flex items-center gap-2 mb-3">
                    <UserOutlined />
                    {dataDetail?.senderName}
                  </p>
                  <p className="flex items-center gap-2 mb-3">
                    <PhoneOutlined />
                    {dataDetail?.senderPhone}
                  </p>
                  <p className="flex items-center gap-2 mb-3">
                    <HomeOutlined />
                    {dataDetail?.senderAddress}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="font-bold mb-3">Người nhận:</p>
                  <p className="flex items-center gap-2 mb-3">
                    <UserOutlined />
                    {dataDetail?.receiverName}
                  </p>
                  <p className="flex items-center gap-2 mb-3">
                    <PhoneOutlined />
                    {dataDetail?.receiverPhone}
                  </p>
                  <p className="flex items-center gap-2 mb-3">
                    <HomeOutlined />
                    {dataDetail?.receiverAddress}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-white rounded-lg shadow-md">
              <h2 className="bg-[#75A0E1] p-4 py-2 font-bold text-white rounded-t-lg">
                Log hành trình
              </h2>
              <div className="p-4">
                <CTable
                  columns={[
                    {
                      title: 'STT',
                      align: 'left',
                      width: 50,
                      fixed: 'left',
                      render(_, record, index) {
                        const stt = index + 1 + (page - 1) * pageSize;
                        return <Text>{stt}</Text>;
                      },
                    },
                    {
                      title: 'Vận hành',
                      dataIndex: 'log',
                      width: 150,
                      align: 'left',
                      render(value, record) {
                        return (
                          <Tooltip title={value} placement="topLeft">
                            <Text>{value}</Text>
                          </Tooltip>
                        );
                      },
                    },
                    {
                      title: 'Tỉnh/Thành phố',
                      dataIndex: 'province',
                      width: 150,
                      align: 'left',
                      render(value, record) {
                        return (
                          <Tooltip title={value} placement="topLeft">
                            <Text>{value}</Text>
                          </Tooltip>
                        );
                      },
                    },
                    {
                      title: 'Quận/Huyện',
                      dataIndex: 'district',
                      width: 150,
                      align: 'left',
                      render(value, record) {
                        return (
                          <Tooltip title={value} placement="topLeft">
                            <Text>{value}</Text>
                          </Tooltip>
                        );
                      },
                    },
                    {
                      title: 'Thời gian tạo',
                      dataIndex: 'time',
                      width: 150,
                      align: 'left',
                      render(value, record) {
                        return (
                          <Tooltip title={value} placement="topLeft">
                            <Text>{value}</Text>
                          </Tooltip>
                        );
                      },
                    },
                  ]}
                  dataSource={dataDetail?.histories}
                  pagination={{
                    pageSize: pageSize,
                    current: page,
                    total: dataDetail?.histories?.length,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                    showSizeChanger: false,
                    showQuickJumper: false,
                    onChange: (page, pageSize) => {
                      setPage(page);
                      setPageSize(pageSize);
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-2 col-start-5">
            <div className="bg-white rounded-lg shadow-md">
              <h2 className="bg-[#75A0E1] p-4 py-2 font-bold text-white rounded-t-lg">
                Thông tin dịch vụ - Hàng hóa
              </h2>
              <div className="p-4">
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Loại dịch vụ:{' '}
                  <strong>{dataDetail?.productInfo?.service}</strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Trọng lượng quy đổi (kg):{' '}
                  <strong>{dataDetail?.productInfo?.dimensionWeight}</strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Trọng lượng (kg):
                  <strong>{dataDetail?.productInfo?.weight}</strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Kích thước (cm):
                  <strong>
                    {dataDetail?.productInfo?.width}x
                    {dataDetail?.productInfo?.length}x
                    {dataDetail?.productInfo?.height}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Nội dung hàng hóa:
                  <Tooltip
                    title={dataDetail?.productInfo?.cargoContent}
                    placement="topRight"
                  >
                    <strong
                      className="whitespace-nowrap overflow-hidden block text-right direction-rtl"
                      style={{ width: '50%', textOverflow: 'ellipsis' }}
                    >
                      {dataDetail?.productInfo?.cargoContent}
                    </strong>
                  </Tooltip>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Giá trị hàng hóa:
                  <strong>
                    {dataDetail?.productInfo?.productAmount
                      ? formatCurrencyVND(
                          dataDetail?.productInfo?.productAmount
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Ngày tạo:
                  <strong>
                    {dataDetail?.productInfo?.deliveryCreatedDate}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Ngày giao:
                  <strong>{dataDetail?.productInfo?.dateDelivery}</strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Trạng thái vận đơn:
                  <strong>{dataDetail?.productInfo?.billStatusDesc}</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-2 col-start-7">
            {' '}
            <div className="bg-white rounded-lg shadow-md">
              <h2 className="bg-[#75A0E1] p-4 py-2 font-bold text-white rounded-t-lg">
                Thông tin thanh toán
              </h2>
              <div className="p-4">
                <p className="flex items-center gap-2 mb-3 justify-between">
                  <strong>Tổng cước:</strong>
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.totalFee
                      ? formatCurrencyVND(
                          dataDetail?.deliveryFeeDetail?.totalFee
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Phí đóng kiện:
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.packingFee
                      ? formatCurrencyVND(
                          dataDetail?.deliveryFeeDetail?.packingFee
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Phí kiểm đếm:
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.countingFee
                      ? formatCurrencyVND(
                          dataDetail?.deliveryFeeDetail?.countingFee
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Phí vận chuyển:
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.mainFee
                      ? formatCurrencyVND(
                          dataDetail?.deliveryFeeDetail?.mainFee
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Phí bảo hiểm:
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.insuranceFee
                      ? formatCurrencyVND(
                          dataDetail?.deliveryFeeDetail?.insuranceFee
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Phí ngoại thành:
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.remoteFee
                      ? formatCurrencyVND(
                          dataDetail?.deliveryFeeDetail?.remoteFee
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Phí nâng hạ:
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.liftingFee
                      ? formatCurrencyVND(
                          dataDetail?.deliveryFeeDetail?.liftingFee
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Phí khác :
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.otherFee
                      ? formatCurrencyVND(
                          dataDetail?.deliveryFeeDetail?.otherFee
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  <strong>Tiền thu hộ (COD):</strong>
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.codAmount
                      ? formatCurrencyVND(
                          dataDetail?.deliveryFeeDetail?.codAmount
                        )
                      : null}
                  </strong>
                </p>
                <p className="flex items-center gap-2 mb-3 justify-between">
                  Phí thu hộ (COD):
                  <strong>
                    {dataDetail?.deliveryFeeDetail?.codFee
                      ? formatCurrencyVND(dataDetail?.deliveryFeeDetail?.codFee)
                      : null}
                  </strong>
                </p>
              </div>
            </div>
          </div>
          <div className="col-start-8 row-start-3 flex justify-end">
            <CButtonClose onClick={() => navigate(-1)} />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default ShippingReportDetail;
