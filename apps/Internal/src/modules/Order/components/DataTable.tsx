import { CTable } from '@react/commons/index';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import Show from '@react/commons/Template/Show';
import { Text } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { formatCurrencyVND } from '@react/helpers/utils';
import useActionMode from '@react/hooks/useActionMode';
import { Col, Row } from 'antd';
import { useGetFileDownload } from 'apps/Internal/src/hooks/useGetFileDownload';
import { memo } from 'react';
import { getColumnsTableProduct } from '../constants';
import useOrderStore from '../stores';

const DataTable = () => {
  const actionMode = useActionMode();
  const { mutate: getFileDownloadOrder } = useGetFileDownload();

  const {
    calculateInfo,
    productSelected,
    removeProductSelected,
    showValidProduct,
  } = useOrderStore();

  const handleDownloadFile = (file: FileData) => {
    getFileDownloadOrder({
      id: file.id as number,
      fileName: file?.files?.fileName ?? '',
    });
  };

  return (
    <Row gutter={[30, 0]} className="mt-6">
      <Col span={24} className="mb-6">
        <CTableUploadFile
          acceptedFileTypes="*"
          disabled={actionMode === ACTION_MODE_ENUM.VIEW}
          onDownload={handleDownloadFile}
          showAction={actionMode !== ACTION_MODE_ENUM.VIEW}
        />
      </Col>
      <Col span={24} className="flex justify-between items-center mb-3">
        <strong className="text-base">Danh sách sản phẩm</strong>
      </Col>
      <Col span={24}>
        <CTable
          dataSource={productSelected}
          locale={{
            emptyText: 'Không có dữ liệu',
          }}
          columns={getColumnsTableProduct(removeProductSelected, actionMode)}
          className="dynamic-table"
          rowClassName={'editable-row align-top'}
          pagination={false}
          scroll={{ y: 'auto' }}
          footer={() => {
            return (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between px-32 items-center">
                  <div>Tổng cộng tiền hàng</div>
                  <div>
                    {formatCurrencyVND(calculateInfo?.amountProduct ?? 0)}
                  </div>
                </div>
                <div className="flex justify-between px-32 items-center">
                  <div>Tổng tiền chiết khấu</div>
                  <div>
                    {formatCurrencyVND(calculateInfo?.amountDiscount ?? 0)}
                  </div>
                </div>
                <div className="flex justify-between px-32 items-center">
                  <div>Tổng tiền thanh toán</div>
                  <div>
                    {formatCurrencyVND(calculateInfo?.amountTotal ?? 0)}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </Col>
      <Show>
        <Show.When isTrue={showValidProduct}>
          <Text type="danger" style={{ fontSize: '14px' }}>
            Không được để trống trường này
          </Text>
        </Show.When>
      </Show>
    </Row>
  );
};

export default memo(DataTable);
