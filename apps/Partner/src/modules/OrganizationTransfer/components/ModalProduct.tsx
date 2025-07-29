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
import { Text } from '@react/commons/Template/style';
import { formatCurrencyVND } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { Col, Flex, Form, Row, TableColumnsType, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { compact } from 'lodash';
import { useState } from 'react';
import useCategoryProducts from '../hooks/useCategoryProducts';
import { ProductRequest, useListProduct } from '../hooks/useListProduct';
import { useOrganizationTransferStore } from '../store';
import { ProductType } from '../types';

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
};

const ModalProduct: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  setListProduct,
  selectedOriginRows = [],
}) => {
  const [form] = Form.useForm();
  const orgId = useOrganizationTransferStore((state) => state.orgId);
  const [selectedRows, setSelectedRows] = useState<ProductType[]>([]);
  const { data: categoryProducts } = useCategoryProducts(orgId ?? undefined);
  const listCategoryAttribute = categoryProducts?.content?.map(
    (e: { id: number; categoryName: string }) => ({
      label: e.categoryName,
      value: e.id,
    })
  );
  const [filter, setFilter] = useState<ProductRequest>(filterDefault);
  const { isFetching, data } = useListProduct(
    {
      ...filter,
      orgId: String(orgId),
    },
    !!orgId
  );
  const { PRODUCT_PRODUCT_UOM = [] } =
    useGetDataFromQueryKey<ParamsOption>([
      REACT_QUERY_KEYS.GET_PARAMS_OPTION,
    ]) ?? {};
  const { page = 0, size = 20 } = filter;
  const { textSearch, productType } = Form.useWatch((e) => e, form) ?? {};

  const selectedIds = selectedRows
    .concat(selectedOriginRows)
    .map(({ id }) => id);
  const handleFinish = (values: any) => {
    selectedRows && setListProduct?.(selectedRows);
    handleCancel();
  };
  const handleSearch = () => {
    setFilter((prev) => ({
      ...prev,
      valueSearch: textSearch,
      productCategoryId: productType,
    }));
  };

  const handleCancel = () => {
    form.resetFields();
    setIsOpen(false);
    setSelectedRows([]);
    setFilter({
      valueSearch: '',
      page: 0,
      size: 20,
      orgId: String(orgId),
    });
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  const handleRefresh = () => {
    form.resetFields();
    setFilter({
      valueSearch: '',
      page: 0,
      size: 20,
      orgId: String(orgId),
    });
  };

  const rowSelection = {
    preserveSelectedRowsKeys: false,
    onChange: (_: React.Key[], selectedRows: ProductType[]) => {
      setSelectedRows(selectedRows);
    },
    selectedRowKeys: selectedIds,
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
      dataIndex: 'productCategoryName',
      width: 100,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'productUom',
      width: 80,
      render: (value: number) => {
        const productType = PRODUCT_PRODUCT_UOM?.find(
          (e) => e.value === value
        )?.label;
        return <CTooltip title={productType}>{productType}</CTooltip>;
      },
    },
    {
      title: 'Đơn giá (VNĐ)',
      dataIndex: 'productPrice',
      width: 120,
      align: 'right',
      render(value) {
        console.log(value);
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
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
          <CButtonSave
            disabled={!compact(selectedIds).length}
            onClick={form.submit}
            htmlType="submit"
          />
          <CButtonClose type="default" onClick={handleCancel} />
        </Flex>,
      ]}
    >
      <Form
        onKeyPress={handleKeyPress}
        form={form}
        onFinish={handleFinish}
        colon={false}
      >
        <Row gutter={[12, 8]}>
          <Col span={8}>
            <Form.Item name="textSearch">
              <CInput
                maxLength={100}
                placeholder="Nhập mã hoặc tên sản phẩm"
                prefix={<FontAwesomeIcon icon={faSearch} />}
                onPressEnter={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="productType">
              <CSelect
                placeholder="Loại sản phẩm"
                options={listCategoryAttribute}
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
          <Col span={24}>
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
          </Col>
        </Row>
      </Form>
    </CModal>
  );
};

export default ModalProduct;
