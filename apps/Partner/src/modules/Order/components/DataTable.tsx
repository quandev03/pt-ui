import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CTable } from '@react/commons/index';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import Show from '@react/commons/Template/Show';
import { Text } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { formatCurrencyVND } from '@react/helpers/utils';
import useActionMode from '@react/hooks/useActionMode';
import { MESSAGE } from '@react/utils/message';
import { Button, Col, Form, Row } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { memo, useState } from 'react';
import { useGetFileDownloadOrder } from '../queryHooks';
import useColumnsTableProduct from '../queryHooks/useColumnsTableProduct';
import useOrderStore from '../stores';
import { IProductInOrder } from '../types';
import SelectProductModal from './SelectProductModal';

const DataTable = () => {
  const actionMode = useActionMode();
  const [openSelectProduct, setOpenSelectProduct] = useState(false);
  const { mutate: getFileDownloadOrder } = useGetFileDownloadOrder();
  const form = useFormInstance();
  const products: IProductInOrder[] = Form.useWatch('products', form) ?? [];

  const { calculateInfo, showValidProduct, showValidDiscount } =
    useOrderStore();

  const handleDownloadFile = (file: FileData) => {
    getFileDownloadOrder({
      id: file.id as number,
      fileName: file?.files?.fileName ?? '',
    });
  };

  const columns = useColumnsTableProduct();

  return (
    <Row gutter={[30, 0]} className="mt-6">
      <Col span={24} className="mb-6">
        <CTableUploadFile
          acceptedFileTypes="*"
          disabled={actionMode === ACTION_MODE_ENUM.VIEW}
          onDownload={
            actionMode === ACTION_MODE_ENUM.CREATE
              ? undefined
              : handleDownloadFile
          }
          showAction={actionMode !== ACTION_MODE_ENUM.VIEW}
        />
      </Col>
      <Col span={24}>
        <Form.List
          name={'products'}
          rules={[
            {
              validator: (role, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(MESSAGE.G06);
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(_, { add, remove }) => (
            <>
              <Col className="flex justify-between items-center mt-4" span={24}>
                <strong className="text-base">{`Danh sách sản phẩm`}</strong>
                {actionMode !== ACTION_MODE_ENUM.VIEW && (
                  <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={() => setOpenSelectProduct(true)}
                  >
                    {`Chọn sản phẩm`}
                  </Button>
                )}
              </Col>
              <Col className="my-4" span={24}>
                <CTable
                  rowKey={'id'}
                  dataSource={products}
                  loading={false}
                  scroll={undefined}
                  columns={columns}
                  rowClassName={'align-top'}
                  footer={() => {
                    return (
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between px-32 items-center">
                          <div>Tổng cộng tiền hàng</div>
                          <div>
                            {formatCurrencyVND(
                              calculateInfo?.amountProduct ?? 0
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between px-32 items-center">
                          <div>Tổng tiền chiết khấu</div>
                          <div className="flex flex-col items-end">
                            <div>
                              {formatCurrencyVND(
                                calculateInfo?.amountDiscount ?? 0
                              )}
                            </div>
                            <Show>
                              <Show.When isTrue={showValidDiscount}>
                                <Text
                                  type="danger"
                                  style={{
                                    fontSize: '14px',
                                    whiteSpace: 'break-spaces',
                                  }}
                                >
                                  Tổng tiền chiết khấu không được lớn hơn tổng
                                  tiền hàng
                                </Text>
                              </Show.When>
                            </Show>
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
                  <Col span={24}>
                    <Text type="danger" style={{ fontSize: '14px' }}>
                      Không được để trống trường này
                    </Text>
                  </Col>
                </Show.When>
              </Show>
            </>
          )}
        </Form.List>
      </Col>
      <SelectProductModal
        open={openSelectProduct}
        onClose={() => setOpenSelectProduct(false)}
      />
    </Row>
  );
};

export default memo(DataTable);
