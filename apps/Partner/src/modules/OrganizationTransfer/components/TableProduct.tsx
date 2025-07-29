import {
  CInput,
  CInputNumber,
  CSelect,
} from '@react/commons/index';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import validateForm from '@react/utils/validator';
import { Form } from 'antd';
import Column from 'antd/lib/table/Column';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { debounce, uniqBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAutoFilterSerial } from '../hooks/useAutoFIlterSerial';
import { useListProduct } from '../hooks/useListProduct';
import { useOrganizationTransferStore } from '../store';
import { ISerialType, ProductType, TypeAutoFilterSerial } from '../types';
import ModalProduct from './ModalProduct';
import TableSerial from './TableSerial';

interface Props {
  actionType: ActionsTypeEnum | ActionType;
  name?: string;
}
const TableProduct: React.FC<Props> = ({ actionType, name = 'products' }) => {
  const form = Form.useFormInstance();
  const isViewType = actionType === ActionType.VIEW;
  const [isOpenProduct, setIsOpenProduct] = useState<boolean>(false);
  const { [name]: dataTable = [{}] } = Form.useWatch((e) => e, form) ?? {};
  const orgId = useOrganizationTransferStore((state) => state.orgId)
  const { isFetching, data } = useListProduct({
    valueSearch: '',
    orgId: String(orgId),
  },
    !!orgId
  );
  const listProduct = useMemo(() => {
    if (!data) return []
    return data.content?.map((e) => ({
      ...e,
      value: e.id,
      label: e?.productName,
      disabled: dataTable.some((item: ProductType) => item.id === e.id),
      checkSerial: e.checkSerial
    }));
  }, [data, dataTable])
  const { PRODUCT_PRODUCT_UOM } =
    useGetDataFromQueryKey<ParamsOption>([
      REACT_QUERY_KEYS.GET_PARAMS_OPTION,
    ]) ?? {};
  const handleSelectProduct = (option: ProductType, idx: number) => {
    const oldProduct = form.getFieldValue([name, idx]);
    const filteredProducts = dataTable.filter((item: ISerialType) =>
      !(item.isChild && item.productId === oldProduct.id)
    );
    filteredProducts[idx] = {
      ...option,
      quantity: null,
      fromSerial: null,
      toSerial: null
    };
    form.setFieldValue(name, filteredProducts);
  };
  const setListProduct = (data: ProductType[]) => {
    form.setFieldValue(
      name,
      JSON.stringify(dataTable) === '[{}]'
        ? data
        : uniqBy(dataTable.concat(data), 'id')
    );
  };
  const { mutateAsync: mutateAutoFilterSerial } = useAutoFilterSerial((data) => {
    const filteredItems = dataTable.filter((item: ProductType) =>
      item.id === data[0].productId
    );

    if (!filteredItems.length) return;

    const filteredProducts = dataTable.filter((item: ISerialType) =>
      !(item.isChild && item.productId === filteredItems[0].id)
    );

    const currentIndex = filteredProducts.indexOf(filteredItems[0]);
    const updatedProducts = [
      ...filteredProducts.slice(0, currentIndex),
      {
        ...data[0],
        id: filteredItems[0].id,
        productId: filteredItems[0].id,
        productCode: filteredItems[0].productCode,
        productName: filteredItems[0].productName,
        productUom: filteredItems[0].productUom,
        checkSerial: (listProduct.find((item: any) => item.id === filteredItems[0].id))?.checkSerial
      },
      ...data[0].serialChildrenList.map(child => ({
        quantity: child.quantity,
        fromSerial: child.fromSerial,
        toSerial: child.toSerial,
        isChild: true,
        productId: filteredItems[0].id,
        checkSerial: (listProduct.find((item: any) => item.id === filteredItems[0].id))?.checkSerial
      })),
      ...filteredProducts.slice(currentIndex + 1)
    ];
    form.setFieldValue(name, updatedProducts);
  });
  const debouncedMutate = useMemo(
    () => debounce((params: {
      productId: number;
      fromSerial?: number;
      quantity: number;
      orgId: number;
      type: number;
    }) => mutateAutoFilterSerial(params), 800),
    [mutateAutoFilterSerial]
  );
  const handleChangeQuantity = useCallback((idx: number) => {
    const fromSerial = form.getFieldValue([name, idx, 'fromSerial']);
    const quantity = form.getFieldValue([name, idx, 'quantity']);
    form.setFields([
      {
        name: [name, idx, 'toSerial'],
        errors: [],
      },
    ]);
    if (quantity && dataTable[idx].checkSerial) {
      debouncedMutate({
        productId: dataTable[idx].id,
        fromSerial: fromSerial ? Number(fromSerial) : undefined,
        quantity: Number(quantity),
        orgId: orgId ?? 0,
        type: TypeAutoFilterSerial.KIT
      });
    }
  }, [dataTable, form, debouncedMutate]);
  const handleChangeSerial = useCallback((idx: number) => {
    const fromSerial = form.getFieldValue([name, idx, 'fromSerial']);
    const quantity = form.getFieldValue([name, idx, 'quantity']);
    if (quantity && fromSerial && validateForm.serialSim.pattern?.test(fromSerial) && dataTable[idx].checkSerial) {
      debouncedMutate({
        productId: dataTable[idx].id,
        fromSerial: Number(fromSerial),
        quantity: Number(quantity),
        orgId: orgId ?? 0,
        type: TypeAutoFilterSerial.KIT
      });
    }
    form.setFields([
      {
        name: [name, idx, 'toSerial'],
        errors: [],
      },
    ]);
  }, [dataTable, form, debouncedMutate]);
  return (
    <>
      <TableSerial
        name={name}
        label="sản phẩm"
        disabled={isViewType}
        handleChoose={() => setIsOpenProduct(true)}
      >
        <Column
          width={155}
          dataIndex="productName"
          title={<div className="label-required-suffix">Tên sản phẩm</div>}
          align="left"
          render={(value, record: any, index) => {
            if (record.isChild) {
              return null;
            }
            return (
              <Form.Item
                name={[index, 'productName']}
                rules={[validateForm.required]}
              >
                <CSelect
                  className='min-w-400'
                  placeholder="Chọn tên sản phẩm"
                  options={listProduct}
                  allowClear={false}
                  disabled={isViewType}
                  onSelect={(value, option) =>
                    handleSelectProduct(option as ProductType, index)
                  }
                  loading={isFetching}
                />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex="productCode"
          title={<div>Mã sản phẩm</div>}
          width={120}
          render={(value, record: any, index: number) => (
            <Form.Item name={[index, 'productCode']}>
              <div>{value}</div>
            </Form.Item>
          )}
        />
        <Column
          width={80}
          dataIndex="productUom"
          title={<div>Đơn vị tính</div>}
          align="left"
          render={(value, record: any, index: number) => (
            <Form.Item name={[index, 'productUom']}>
              <div>{PRODUCT_PRODUCT_UOM?.find((e) => String(e.value) === String(value))?.label}</div>
            </Form.Item>
          )}
        />
        <Column
          width={160}
          dataIndex="quantity"
          title={<div>Số lượng</div>}
          align="left"
          render={(value, record, idx) => {
            return (
              <Form.Item
                name={[idx, 'quantity']}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  validateForm.required,
                  validateForm.minNumber(1, 'Số lượng phải lớn hơn 0'),
                ]}
              >
                <CInput
                  onlyNumber
                  disabled={record.isChild || isViewType}
                  onChange={() => handleChangeQuantity(idx)}
                  maxLength={9}
                  placeholder="Số lượng"
                  type="number"
                  preventSpace
                />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex="fromSerial"
          title={<div>Serial đầu</div>}
          width={155}
          ellipsis={{ showTitle: false }}
          render={(value, record: any, idx: number) => {
            return (
              <Form.Item
                name={[idx, 'fromSerial']}
                messageVariables={{ label: 'Serial đầu' }}
                rules={[
                  //@ts-ignore
                  record?.quantity && record.checkSerial ? validateForm.required : undefined,
                  validateForm.serialSim,
                ]}
              >
                <CInput
                  onlyNumber
                  type="number"
                  onChange={() => handleChangeSerial(idx)}
                  maxLength={16}
                  disabled={record.isChild || isViewType || !record.checkSerial}
                  placeholder="Serial đầu"
                  preventSpace
                />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex="toSerial"
          title="Serial cuối"
          width={155}
          render={(value, record: any, idx: number) => (
            <Form.Item
              rules={[
                {
                  validator: () => {
                    if (record.checkSerial && record.id && record.fromSerial && !record.toSerial) {
                      return Promise.reject(
                        new Error('Số lượng serial trong kho không đủ')
                      )
                    }
                    return Promise.resolve()
                  }
                }
              ]}
              name={[idx, 'toSerial']}>
              <CInputNumber disabled placeholder="Serial cuối" />
            </Form.Item>
          )}
        />
      </TableSerial>
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
