import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonClose, CButtonSave } from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CModal from '@react/commons/Modal';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { RowHeader } from '@react/commons/Template/style';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { Col, Form, Row, Tooltip } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { ColumnsType, TableProps } from 'antd/es/table';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useGetChooseProduct,
  useGetChooseProductImport,
} from '../hooks/useGetChooseProduct';
import useModal from '../store/useModal';
import {
  ICategoryProducts,
  IItemProduct,
  ParamsSearch,
  TypePage,
} from '../type';
import {
  useGetAllCategoryInStock,
  useGetCategoryInStock,
} from '../hooks/useGetCategoryInStock';

const ModalSelectInventory: React.FC<{ type: TypePage }> = ({ type }) => {
  const formInstance = useFormInstance();
  const { pathname } = useLocation();
  const orgId = useWatch('orgId', formInstance);
  const products = useWatch<IItemProduct[]>('products', formInstance) ?? [];
  const [form] = Form.useForm();
  const { isOpen, setIsOpen } = useModal();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tempProduct, setTempProduct] = useState<IItemProduct[]>([]);
  const [params, setParams] = useState<ParamsSearch>({
    page: 0,
    size: 20,
  });

  const {
    data: categoriByOrg = [],
    fetchNextPage: userFetchNextPageCategory,
    hasNextPage: userHasNextPageCategory,
    isLoading: loadingCategory,
    refetch: refetchCategory,
  } = useGetCategoryInStock(type === TypePage.EXPORT && isOpen, orgId);
  const {
    data: allCategory = [],
    fetchNextPage: userFetchNextPageAllCategory,
    hasNextPage: userHasNextPageAllCategory,
    isLoading: loadingAllCategory,
    refetch: refetchAllCategory,
  } = useGetAllCategoryInStock(type === TypePage.IMPORT && isOpen, {
    page: 0,
    size: 20,
  });

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      if (
        userHasNextPageCategory &&
        !loadingCategory &&
        type === TypePage.EXPORT
      ) {
        userFetchNextPageCategory();
      } else if (
        userHasNextPageAllCategory &&
        !loadingAllCategory &&
        type === TypePage.IMPORT
      ) {
        userFetchNextPageAllCategory();
      }
    }
  };
  const { PRODUCT_CATEGORY_CATEGORY_TYPE = [], PRODUCT_PRODUCT_UOM = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const listTypeProductExport = PRODUCT_CATEGORY_CATEGORY_TYPE.filter(
    (item) =>
      item.value === ICategoryProducts.SimTrang ||
      item.value === ICategoryProducts.ESim ||
      item.value === ICategoryProducts.Kit
  ).map((category) => {
    return category.value.toString();
  });

  const listTypeProductImport = PRODUCT_CATEGORY_CATEGORY_TYPE.filter(
    (item) =>
      item.value === ICategoryProducts.SimTrang ||
      item.value === ICategoryProducts.ESim
  ).map((category) => {
    return category.value.toString();
  });

  const { data: listChooseProduct, isLoading } = useGetChooseProduct(
    {
      ...params,
      orgIds: [orgId],
      categoryTypes: listTypeProductExport,
    },
    isOpen && type === TypePage.EXPORT
  );
  const { data: ProductImport } = useGetChooseProductImport(
    {
      ...params,
      orgIds: [orgId],
      categoryTypes: listTypeProductImport,
    },
    isOpen && type === TypePage.IMPORT
  );
  const dataTable =
    type === TypePage.IMPORT
      ? ProductImport?.content
      : listChooseProduct?.content;
  const total =
    type === TypePage.IMPORT
      ? ProductImport?.totalElements
      : listChooseProduct?.totalElements;

  const handleCloseModal = () => {
    setIsOpen(false);
    refetchCategory();
    refetchAllCategory();
  };

  useEffect(() => {
    setParams({ page: 0, size: 20 });
    form.resetFields();
  }, [pathname]);

  const handleChangeTable = useCallback(
    (page: number, size: number) => {
      setParams({
        ...params,
        page: page - 1,
        size: size,
      });
    },
    [params]
  );

  useEffect(() => {
    if (isOpen) {
      const products: IItemProduct[] =
        formInstance.getFieldValue('products') ?? [];
      const selectedKeys: Key[] = products.map((product) => product.id as Key);
      setSelectedRowKeys(selectedKeys);
    } else {
      handleRefresh();
    }
  }, [isOpen]);

  const rowSelection: TableProps<IItemProduct>['rowSelection'] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IItemProduct[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setTempProduct(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
    preserveSelectedRowKeys: true,
  };

  const handleSearch = useCallback(
    (values: Record<string, string>) => {
      setParams({ ...params, ...values });
    },
    [params, setParams, form]
  );

  const handleRefresh = () => {
    form.resetFields();
    setParams({
      page: 0,
      size: 20,
    });
  };

  const handSave = () => {
    const data: IItemProduct[] = tempProduct.map((item) => {
      const findItemInListProducts = products.find((i) => item.id === i.id);
      if (findItemInListProducts) {
        return { ...findItemInListProducts };
      }
      return {
        ...item,
        children: [],
      };
    });
    formInstance.setFieldValue('products', data);
    setIsOpen(false);
  };

  const columns: ColumnsType<IItemProduct> = [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      render(value, record, index) {
        return (
          <Tooltip title={index + 1} placement="topLeft">
            {index + 1}
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'productCategoryName',
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'productUom',
      align: 'left',
      render: (value) => {
        const label = PRODUCT_PRODUCT_UOM?.find(
          (e: any) => e.value === String(value)
        )?.label;
        return (
          <Tooltip title={label} placement="topLeft">
            {label}
          </Tooltip>
        );
      },
    },
  ];

  return (
    <CModal
      open={isOpen}
      width={1000}
      title={'Chọn sản phẩm'}
      onCancel={() => handleCloseModal()}
      footer={() => (
        <div className={'flex justify-end w-full gap-3'}>
          <CButtonSave
            type="primary"
            className={'min-w-[120px]'}
            onClick={handSave}
            disabled={selectedRowKeys.length === 0}
          >
            Lưu
          </CButtonSave>
          <CButtonClose
            type="default"
            onClick={() => handleCloseModal()}
            className={'min-w-[120px]'}
          >
            Đóng
          </CButtonClose>
        </div>
      )}
      centered
    >
      <RowHeader>
        <Form
          form={form}
          onFinish={handleSearch}
          colon={false}
          requiredMark={false}
        >
          <Row gutter={[24, 8]}>
            <Col span={8}>
              <Form.Item name={'valueSearch'}>
                <CInput
                  maxLength={100}
                  max="20"
                  placeholder="Nhập mã hoặc tên sản phẩm"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={'categoryIds'}>
                <CSelect
                  options={
                    type === TypePage.IMPORT ? allCategory : categoriByOrg
                  }
                  onPopupScroll={handleScroll}
                  loading={loadingCategory || loadingAllCategory}
                  disabled={false}
                  placeholder="Chọn loại sản phẩm"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div className={'flex items-center gap-3'}>
                <CButton htmlType="submit">Tìm kiếm</CButton>
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
      </RowHeader>
      <CTable
        rowKey="id"
        columns={columns}
        rowSelection={rowSelection}
        dataSource={dataTable ?? []}
        loading={isLoading}
        scroll={{ y: 400 }}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: total ?? 0,
          onChange: handleChangeTable,
        }}
      />
    </CModal>
  );
};

export default ModalSelectInventory;
