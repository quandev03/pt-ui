import { CInput, DebounceSelect, TableDynamic } from '@react/commons/index';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import validateForm from '@react/utils/validator';
import { Form } from 'antd';
import Column from 'antd/lib/table/Column';
import { useMemo, useState } from 'react';
import { useMutateListProduct } from '../hooks/useListProduct';
import { ProductType } from '../types';
import ModalProduct from './ModalProduct';
import { isEmpty, uniqBy } from 'lodash';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

interface Props {
  actionType: ActionsTypeEnum | ActionType;
  name?: string;
}

const TableProduct: React.FC<Props> = ({ actionType, name = 'products' }) => {
  const form = Form.useFormInstance();
  const isViewType = actionType === ActionType.VIEW;
  const { PRODUCT_PRODUCT_UOM = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const [isOpenProduct, setIsOpenProduct] = useState<boolean>(false);
  const { [name]: dataTable = [{}] }: { [name: string]: any[] } =
    Form.useWatch((e) => e, form) ?? {};
  const { mutateAsync: mutateListProduct, data: listProduct = [] } =
    useMutateListProduct();

  const listCurrentProduct = useMemo(
    () => (value: string) => {
      const selectedProductId = dataTable
        ?.map((e) => e.id)
        ?.filter((c) => c !== value);
      return listProduct.filter((d) => !selectedProductId.includes(d.value));
    },
    [listProduct]
  );

  const handleSelectProduct = (option: ProductType, idx: number) => {
    const productItem = form.getFieldValue([name, idx]);
    form.setFieldValue([name, idx], { ...productItem, ...option });
  };
  const setListProduct = (data: ProductType[]) => {
    form.setFieldValue(
      name,
      JSON.stringify(dataTable) === '[{}]'
        ? data
        : uniqBy(dataTable.concat(data), 'id')
    );
  };
  const handleClearProduct = (idx: number) => {
    form.setFieldValue(
      'products',
      dataTable.map((e, index) => (index === idx ? {} : e))
    );
  };
  return (
    <>
      <TableDynamic
        name="products"
        label="sản phẩm"
        disabled={isViewType}
        handleChoose={() => setIsOpenProduct(true)}
      >
        <Column
          width={175}
          dataIndex="productCode"
          title={<div className="label-required-suffix">Tên sản phẩm</div>}
          align="left"
          render={(value, record: any, index) => (
            <Form.Item
              name={[index, 'productName']}
              rules={[validateForm.required]}
            >
              <DebounceSelect
                placeholder="Chọn tên sản phẩm"
                fetchOptions={mutateListProduct}
                disabled={isViewType}
                onSelect={(_, option) =>
                  handleSelectProduct(option as ProductType, index)
                }
                getCurrentList={listCurrentProduct(value)}
                onClear={() => handleClearProduct(index)}
              />
            </Form.Item>
          )}
        />
        <Column
          dataIndex="productCode"
          title={<div>Mã sản phẩm</div>}
          width={175}
          render={(value, record: any, index: number) => (
            <Form.Item name={[index, 'productCode']}>
              <div>{value}</div>
            </Form.Item>
          )}
        />
        <Column
          width={155}
          dataIndex="productUom"
          title={<div>Đơn vị</div>}
          align="left"
          render={(value, record: any, index: number) => (
            <Form.Item name={[index, 'productUom']}>
              <div>
                {PRODUCT_PRODUCT_UOM?.find((e) => e.value === value)?.label ??
                  value}
              </div>
            </Form.Item>
          )}
        />
        <Column
          width={145}
          dataIndex="quantity"
          title={<div className="label-required-suffix">Số lượng</div>}
          align="left"
          render={(value, __, idx) => {
            return (
              <Form.Item
                name={[idx, 'quantity']}
                rules={[
                  validateForm.required,
                  validateForm.minNumber(1, 'Số lượng phải lớn hơn 0'),
                ]}
              >
                <CInput
                  placeholder="Số lượng"
                  maxLength={9}
                  disabled={isViewType}
                  onlyNumber
                  type="number"
                />
              </Form.Item>
            );
          }}
        />
      </TableDynamic>
      <ModalProduct
        isOpen={isOpenProduct}
        setIsOpen={setIsOpenProduct}
        setListProduct={setListProduct}
        selectedOriginRows={dataTable}
      />
    </>
  );
};

export default TableProduct;
