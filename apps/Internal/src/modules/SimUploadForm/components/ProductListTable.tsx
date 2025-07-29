import CTable from '@react/commons/Table';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { FormInstance } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import React, { useEffect } from 'react';
import { getColumnsTableProduct } from '../constant';
import { IProductItem, OrderLine } from '../types';
type Props = {
  dataTable: IProductItem[] | OrderLine[];
  isLoading: boolean;
  handleChangeAmount: (index: number, value: number) => void;
  orderLineForm: FormInstance;
  isViewDetail: boolean;
};
const TableProduct: React.FC<Props> = ({
  dataTable,
  isLoading,
  handleChangeAmount,
  orderLineForm,
  isViewDetail,
}) => {
  const { PRODUCT_PRODUCT_UOM = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  useEffect(() => {
    if (isViewDetail && dataTable) {
      const formValues = dataTable.reduce((amountNumbers, record, index) => {
        amountNumbers[index] = { amountNumber: record.amountNumber };
        return amountNumbers;
      }, {} as Record<number, { amountNumber: number }>);
      orderLineForm.setFieldsValue(formValues);
    }
  }, [isViewDetail, dataTable]);
  return (
    <>
      <div className="mt-5 mb-2">
        <strong>Danh sách sản phẩm</strong>
      </div>
      <CTable
        columns={getColumnsTableProduct(
          PRODUCT_PRODUCT_UOM,
          handleChangeAmount,
          orderLineForm,
          isViewDetail
        )}
        dataSource={dataTable}
        loading={isLoading}
      />
    </>
  );
};
export default TableProduct;
