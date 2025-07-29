import {
  faMagnifyingGlass,
  faRotateLeft,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonAdd, CButtonClose } from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CModal from '@react/commons/Modal';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { Col, Form, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { FC, Key, memo, useEffect, useMemo, useState } from 'react';
import { getColumnsTableProductSelect } from '../constants';
import {
  useGetOrderProduct,
  useGetProductType,
  useSupportGetCalculateDiscount,
} from '../queryHooks';
import useOrderStore from '../stores';
import { IParamsProduct, IProductInOrder } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
};

const SelectProductModal: FC<Props> = ({ open, onClose }) => {
  const formInstance = useFormInstance();
  const [form] = Form.useForm();
  const products = useWatch<IProductInOrder[]>('products', formInstance) ?? [];
  const { calculateInfo, setCalculateInfo, setShowValidDiscount } =
    useOrderStore();
  const [tempProduct, setTempProduct] = useState<IProductInOrder[]>([]);
  const [params, setParams] = useState<IParamsProduct>({
    page: 0,
    size: 20,
    categoryId: '',
    query: '',
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const handleClose = () => {
    setSelectedRowKeys([]);
    setParams({ page: 0, size: 20, categoryId: '', query: '' });
    form.resetFields();
    onClose();
  };

  const { mutate: getCalculateDiscountAction } = useSupportGetCalculateDiscount(
    (data) => {
      const isDiscountValid =
        data.amountAdditionalDiscount > data.amountProduct;
      setShowValidDiscount(isDiscountValid);
      const updatedProducts = data.orderDetailInfos
        .filter((item) =>
          data.orderDetailInfos
            .map((item) => item.productId)
            .includes(item.productId)
        )
        .map((product) => {
          const currentProduct = data.orderDetailInfos.find(
            (item) => item.productId === product.productId
          );

          const result: IProductInOrder = { ...product, ...currentProduct };

          const preferentialLinesCurrent = data.preferentialLines.filter(
            (item) => item.productId === product.productId
          );

          preferentialLinesCurrent.forEach((item) => {
            if (item.discountType === 1) {
              result.packageDiscountAmount = item.amount;
            } else if (item.discountType === 2) {
              result.simDiscountAmount = item.amount;
            }
          });
          return result;
        })
        .filter((item) => item.productId);
      formInstance.setFieldValue('products', updatedProducts);
      setCalculateInfo(data);
      handleClose();
    }
  );

  useEffect(() => {
    if (open) {
      const products: IProductInOrder[] =
        formInstance.getFieldValue('products') ?? [];
      const cleanedProducts = products.filter(Boolean);
      const selectedKeys: Key[] = cleanedProducts.map(
        (product) => product.productId as Key
      );
      setSelectedRowKeys(selectedKeys);
      setTempProduct(cleanedProducts);
    }
  }, [open, formInstance]);

  const { data: productType = [] } = useGetProductType();
  const productTypeOption = useMemo(() => {
    if (productType)
      return productType.map((item) => ({
        label: item.categoryName,
        value: item.categoryId,
      }));
    return [];
  }, [productType]);

  const { data: productsList, isLoading: loadingTable } = useGetOrderProduct({
    ...params,
    isCall: open,
  });
  const dataTable = useMemo(() => {
    if (productsList) return productsList.content;
    return [];
  }, [productsList]);
  const handleFinish = (values: IParamsProduct) => {
    setParams({
      ...params,
      ...values,
    });
  };
  const handleRefresh = () => {
    setParams({
      page: 0,
      size: 20,
      categoryId: '',
      query: '',
    });
    form.resetFields();
  };

  const handleAdd = () => {
    if (tempProduct && tempProduct.length > 0) {
      const newProducts = tempProduct.filter(Boolean).map((item) => {
        if (!item.quantity) item.quantity = 1;
        return item;
      });
      getCalculateDiscountAction({
        orderDetailInfos: newProducts,
        amountAdditionalDiscount: calculateInfo?.amountAdditionalDiscount ?? 0,
      });
    }
    handleClose();
  };

  return (
    <CModal
      title={'Chọn sản phẩm'}
      open={open}
      width={1000}
      onCancel={onClose}
      footer={null}
    >
      <Row gutter={[16, 30]}>
        <Col span={24}>
          <Form
            form={form}
            validateTrigger={['onSubmit']}
            onFinish={handleFinish}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={'query'}>
                  <CInput
                    maxLength={100}
                    placeholder="Nhập mã hoặc tên sản phẩm"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={'categoryId'}>
                  <CSelect
                    options={productTypeOption}
                    className="!w-full"
                    placeholder="Chọn loại sản phẩm"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <div className="flex flex-wrap gap-4 items-center">
                  <CButton
                    icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                    htmlType="submit"
                  >
                    Tìm kiếm
                  </CButton>
                  <FontAwesomeIcon
                    icon={faRotateLeft}
                    size="lg"
                    className="cursor-pointer"
                    onClick={handleRefresh}
                    title="Làm mới"
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={24}>
          <CTable
            dataSource={dataTable}
            columns={getColumnsTableProductSelect(params)}
            loading={loadingTable}
            rowKey={'productId'}
            scroll={{ y: 400 }}
            rowSelection={{
              selectedRowKeys,
              onChange: (
                selectedRowKeys: React.Key[],
                selectedRows: IProductInOrder[]
              ) => {
                setSelectedRowKeys(selectedRowKeys);
                const newTempProduct = selectedRows.map((item) => {
                  const currentProduct = products.find(
                    (product) => product?.productId === item?.productId
                  );
                  if (currentProduct) {
                    return { ...item, ...currentProduct };
                  }
                  return item;
                });
                setTempProduct(newTempProduct);
              },

              getCheckboxProps: (record: any) => ({
                name: record.name,
              }),
              preserveSelectedRowKeys: true,
            }}
            pagination={{
              total: productsList?.totalElements ?? 0,
              current: params.page + 1,
              pageSize: params.size,
              onChange: (page: number, pageSize: number) => {
                setParams((prev) => ({
                  ...prev,
                  page: page - 1,
                  size: pageSize,
                }));
              },
            }}
          />
        </Col>
        <Col span={24}>
          <div className="flex gap-4 justify-end">
            <CButtonAdd
              onClick={handleAdd}
              type="primary"
              disabled={selectedRowKeys.filter(Boolean).length === 0}
            >
              Thêm mới
            </CButtonAdd>
            <CButtonClose onClick={handleClose}>Hủy</CButtonClose>
          </div>
        </Col>
      </Row>
    </CModal>
  );
};

export default memo(SelectProductModal);
