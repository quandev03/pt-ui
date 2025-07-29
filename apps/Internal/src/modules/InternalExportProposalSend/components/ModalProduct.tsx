import {
  faMagnifyingGlass,
  faRotateLeft,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonClose, CButtonSave } from '@react/commons/Button';
import {
  Button,
  CInput,
  CModal,
  CSelect,
  CTable,
  CTooltip,
} from '@react/commons/index';
import { Col, Flex, Form, Row, TableColumnsType } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import useGetCategoryProduct, {
  IProductCategory,
} from '../hook/useGetCategoryProduct';
import { useListProduct } from '../hook/useGetListProduct';
import { ICategoryProducts, ProductType } from '../type';
import useStoreInternalExportProposal from '../store';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from '@react/commons/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

export interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setListProduct?: (value: ProductType[]) => void;
  selectedOriginRows?: ProductType[];
}

export const filterDefault = {
  valueSearch: '',
  page: 0,
  size: 20,
  categoryTypes: [
    ICategoryProducts.ESIM,
    ICategoryProducts.KIT,
    ICategoryProducts.SIM_VAT_LY,
  ],
};
const ModalProduct: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  setListProduct,
  selectedOriginRows = [],
}) => {
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<ProductType[]>([]);
  const { orgIds } = useStoreInternalExportProposal();
  const [filter, setFilter] = useState(filterDefault);
  const { isFetching, data } = useListProduct(filter, !!orgIds && isOpen);
  const { data: dataCategoryProduct, isPending: isPendingCategoryProduct } =
    useGetCategoryProduct(isOpen);
  const listCategoryProduct = useMemo(() => {
    if (!dataCategoryProduct) return [];
    return dataCategoryProduct.content.map((e: IProductCategory) => ({
      label: e.categoryName,
      value: e.id,
    }));
  }, [dataCategoryProduct]);
  const { PRODUCT_PRODUCT_UOM } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]) ?? {};
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      orgIds: [orgIds],
    }));
  }, [orgIds, isOpen]);
  const { page = 0, size = 20 } = filter;
  const { textSearch, productType } = Form.useWatch((e) => e, form) ?? {};
  const handleFinish = () => {
    selectedRows && setListProduct?.(selectedRows);
    handleCancel();
  };
  const handleSearch = () => {
    setFilter((prev) => ({
      ...prev,
      valueSearch: textSearch,
      categoryIds: productType ? [Number(productType)] : [],
    }));
  };

  const handleCancel = () => {
    form.resetFields();
    setIsOpen(false);
    setSelectedRows([]);
    setFilter(filterDefault);
  };

  const handleRefresh = () => {
    form.resetFields();
    setFilter({ ...filterDefault });
  };

  const rowSelection = {
    preserveSelectedRowsKeys: false,
    onChange: (_: React.Key[], selectedRows: ProductType[]) => {
      setSelectedRows(selectedRows);
    },
    selectedRowKeys: selectedRows
      .concat(selectedOriginRows)
      .map(({ id }) => id),
    getCheckboxProps: (record: ProductType) => ({
      disabled: selectedOriginRows.map(({ id }) => id).includes(record.id),
    }),
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    setFilter((prev) => ({ ...prev, page: page - 1, size: pageSize }));
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, __, idx: number) => {
        return <div>{page * size + ++idx}</div>;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 150,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 130,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'productCategoryId',
      width: 100,
      render: (value: string) => {
        const productType = listCategoryProduct?.find(
          (e: { value: string }) => e.value === value
        )?.label;
        return <CTooltip title={productType}>{productType}</CTooltip>;
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'productUom',
      width: 80,
      render: (value: string) => {
        const text = PRODUCT_PRODUCT_UOM?.find(
          (e) => String(e.value) === String(value)
        )?.label;
        return <CTooltip title={text}>{text}</CTooltip>;
      },
    },
  ];

  return (
    <CModal
      title={'Chọn sản phẩm'}
      open={isOpen}
      loading={false}
      width={1000}
      onCancel={handleCancel}
      className="modal-body-shorten"
      footer={[
        <Flex justify="end" gap={12} className="w-full">
          <CButtonClose type="default" onClick={handleCancel} />
          <CButtonSave
            disabled={!selectedRows}
            onClick={form.submit}
            htmlType="submit"
          />
        </Flex>,
      ]}
    >
      <Form form={form} onFinish={handleFinish} colon={false}>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item name="textSearch">
              <CInput
                maxLength={100}
                placeholder="Nhập mã hoặc tên sản phẩm"
                prefix={<FontAwesomeIcon icon={faSearch} />}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="productType" label="Loại sản phẩm">
              <CSelect
                placeholder="Loại sản phẩm"
                options={listCategoryProduct}
                isLoading={isPendingCategoryProduct}
              />
            </Form.Item>
          </Col>
          <Col>
            <Button
              icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
            <FontAwesomeIcon
              icon={faRotateLeft}
              size="lg"
              className="cursor-pointer self-center ml-2"
              onClick={handleRefresh}
              title="Làm mới"
            />
          </Col>
          <CTable
            rowKey={'id'}
            columns={columns}
            dataSource={data?.content ?? []}
            rowSelection={rowSelection}
            pagination={{
              current: page + 1,
              total: data?.totalElements,
              pageSize: size,
              onChange: handleChangePagination,
            }}
            scroll={{ y: 390 }}
            loading={isFetching}
            className="animation-table"
          />
        </Row>
      </Form>
    </CModal>
  );
};

export default ModalProduct;
