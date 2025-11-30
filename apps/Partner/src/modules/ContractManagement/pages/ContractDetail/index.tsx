import {
  CButtonClose,
  TitleHeader,
  RenderCell,
} from '@vissoft-react/common';
import { Col, Row, Spin, Button, Card } from 'antd';
import { memo } from 'react';
import { useLogicContractDetail } from './useLogicContractDetail';
import dayjs from 'dayjs';
import { formatDate, formatDateTime } from '@vissoft-react/common';

export const ContractDetail = memo(() => {
  const {
    contractDetail,
    loadingDetail,
    handleClose,
    handlePrintContract,
    findRoomName,
    getDownloadUrl,
    contractPdfBlobUrl,
  } = useLogicContractDetail();

  if (loadingDetail) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!contractDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Không tìm thấy thông tin hợp đồng</p>
        <CButtonClose onClick={handleClose} className="mt-4" />
      </div>
    );
  }

  // Lấy dữ liệu từ API response
  const tenantName = contractDetail.tenantName || contractDetail.name || '-';
  const tenantAddress = contractDetail.tenantPermanentAddress || contractDetail.address || contractDetail.roomAddress || '-';
  const tenantPhone = contractDetail.tenantPhone || contractDetail.phone || '-';
  const contractPdfPath = contractDetail.contractPdfUrl || contractDetail.contractFileUrl;
  const contractPdfDownloadUrl = contractPdfPath ? getDownloadUrl(contractPdfPath) : '';
  
  // URLs cho ảnh giấy tờ
  const frontImageUrl = contractDetail.frontImageUrl ? getDownloadUrl(contractDetail.frontImageUrl) : '';
  const backImageUrl = contractDetail.backImageUrl ? getDownloadUrl(contractDetail.backImageUrl) : '';
  const portraitImageUrl = contractDetail.portraitImageUrl ? getDownloadUrl(contractDetail.portraitImageUrl) : '';
  
  // Tạo dates từ day/month/year
  const startDate = contractDetail.startDateDay && contractDetail.startDateMonth && contractDetail.startYear
    ? dayjs(`${contractDetail.startYear}-${contractDetail.startDateMonth}-${contractDetail.startDateDay}`)
    : contractDetail.startDate ? dayjs(contractDetail.startDate) : null;
  const endDate = contractDetail.endDateDay && contractDetail.endDateMonth && contractDetail.endYear
    ? dayjs(`${contractDetail.endYear}-${contractDetail.endDateMonth}-${contractDetail.endDateDay}`)
    : contractDetail.endDate ? dayjs(contractDetail.endDate) : null;
  
  const roomName = contractDetail.roomName || (contractDetail.roomId ? findRoomName(contractDetail.roomId) : '-');

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>Chi tiết hợp đồng</TitleHeader>

      <div className="bg-white rounded-[10px] px-6 pt-4 pb-8 mt-4">
        {/* Thông tin người thuê */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Thông tin người thuê
          </h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <span className="font-medium">Họ và tên: </span>
                <span>{tenantName}</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Số CCCD: </span>
                <span>{contractDetail.tenantId || '-'}</span>
              </div>
            </Col>
            <Col span={24}>
              <div>
                <span className="font-medium">Địa chỉ: </span>
                <span>{tenantAddress}</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Ngày sinh: </span>
                <span>{contractDetail.tenantBirth || '-'}</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Số điện thoại: </span>
                <span>{tenantPhone}</span>
              </div>
            </Col>
            {contractDetail.tenantIdIssueDay && contractDetail.tenantIdIssueMonth && contractDetail.tenantIdIssueYear && (
              <>
                <Col span={12}>
                  <div>
                    <span className="font-medium">Ngày cấp: </span>
                    <span>{`${contractDetail.tenantIdIssueDay}/${contractDetail.tenantIdIssueMonth}/${contractDetail.tenantIdIssueYear}`}</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <span className="font-medium">Nơi cấp: </span>
                    <span>{contractDetail.tenantIdIssuePlace || '-'}</span>
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>

        {/* Thông tin hợp đồng */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin hợp đồng</h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <span className="font-medium">Phòng: </span>
                <span>{roomName}</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Địa điểm ký hợp đồng: </span>
                <span>{contractDetail.contractLocation || '-'}</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Thời gian bắt đầu: </span>
                <span>
                  {startDate && startDate.isValid()
                    ? startDate.format(formatDate)
                    : '-'}
                </span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Thời gian kết thúc: </span>
                <span>
                  {endDate && endDate.isValid()
                    ? endDate.format(formatDate)
                    : '-'}
                </span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Giá thuê: </span>
                <span>{contractDetail.rentPrice ? `${contractDetail.rentPrice} VNĐ` : '-'}</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Tiền cọc: </span>
                <span>{contractDetail.depositAmount ? `${contractDetail.depositAmount} VNĐ` : '-'}</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Phương thức thanh toán: </span>
                <span>{contractDetail.paymentMethod || '-'}</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="font-medium">Thời hạn báo trước: </span>
                <span>{contractDetail.noticeDays ? `${contractDetail.noticeDays} ngày` : '-'}</span>
              </div>
            </Col>
            {contractDetail.createdDate && (
              <Col span={12}>
                <div>
                  <span className="font-medium">Ngày tạo: </span>
                  <span>
                    {dayjs(contractDetail.createdDate).format(formatDateTime)}
                  </span>
                </div>
              </Col>
            )}
            {contractDetail.createdBy && (
              <Col span={12}>
                <div>
                  <span className="font-medium">Người tạo: </span>
                  <span>{contractDetail.createdBy}</span>
                </div>
              </Col>
            )}
          </Row>
        </div>

        {/* Ảnh giấy tờ tùy thân */}
        {(frontImageUrl || backImageUrl || portraitImageUrl) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Ảnh giấy tờ tùy thân</h3>
            <Row gutter={[16, 16]}>
              {frontImageUrl && (
                <Col span={8}>
                  <Card title="Mặt trước CCCD" size="small">
                    <img
                      src={frontImageUrl}
                      alt="Mặt trước CCCD"
                      style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }}
                    />
                    <div className="mt-2">
                      <Button
                        size="small"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = frontImageUrl;
                          link.download = 'front.jpg';
                          link.click();
                        }}
                      >
                        Tải xuống
                      </Button>
                    </div>
                  </Card>
                </Col>
              )}
              {backImageUrl && (
                <Col span={8}>
                  <Card title="Mặt sau CCCD" size="small">
                    <img
                      src={backImageUrl}
                      alt="Mặt sau CCCD"
                      style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }}
                    />
                    <div className="mt-2">
                      <Button
                        size="small"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = backImageUrl;
                          link.download = 'back.jpg';
                          link.click();
                        }}
                      >
                        Tải xuống
                      </Button>
                    </div>
                  </Card>
                </Col>
              )}
              {portraitImageUrl && (
                <Col span={8}>
                  <Card title="Ảnh chân dung" size="small">
                    <img
                      src={portraitImageUrl}
                      alt="Ảnh chân dung"
                      style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }}
                    />
                    <div className="mt-2">
                      <Button
                        size="small"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = portraitImageUrl;
                          link.download = 'portrait.jpg';
                          link.click();
                        }}
                      >
                        Tải xuống
                      </Button>
                    </div>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        )}

        {/* Hợp đồng đã gen */}
        {(contractPdfBlobUrl || contractPdfDownloadUrl) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Hợp đồng</h3>
            <Card>
              {contractPdfBlobUrl ? (
                <iframe
                  src={contractPdfBlobUrl}
                  style={{ width: '100%', height: '600px', border: 'none' }}
                  title="Contract Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <Spin size="large" tip="Đang tải file hợp đồng..." />
                </div>
              )}
              <div className="mt-4">
                <Button
                  onClick={() => {
                    if (contractPdfBlobUrl) {
                      const link = document.createElement('a');
                      link.href = contractPdfBlobUrl;
                      link.download = 'contract.pdf';
                      link.click();
                    } else if (contractPdfDownloadUrl) {
                      window.open(contractPdfDownloadUrl, '_blank');
                    }
                  }}
                  disabled={!contractPdfBlobUrl}
                >
                  Tải xuống
                </Button>
              </div>
            </Card>
          </div>
        )}

        <div className="flex gap-4 justify-end mt-6">
          <Button onClick={handlePrintContract}>In hợp đồng</Button>
          <CButtonClose onClick={handleClose} />
        </div>
      </div>
    </div>
  );
});

