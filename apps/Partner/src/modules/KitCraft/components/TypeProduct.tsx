import { CSelect, DebounceSelect } from '@react/commons/index';
import { ActionType } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import validateForm from '@react/utils/validator';
import { Col, Form } from 'antd';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import {
  ProductType,
  ReqProduct,
  useMutateProductList,
} from '../hooks/useGetProductList';
import '../index.scss';
import { KitAddViewProps } from './TypeOrder';
import { useEffect, useState } from 'react';

interface ComponentProps {
  setSelectedProduct: any;
  selectedProduct: ProductType | undefined;
  isSingleCraft?: boolean;
}

const TypeProduct: React.FC<KitAddViewProps & ComponentProps> = ({
  actionType,
  setSelectedProduct,
  selectedProduct,
  isSingleCraft = false,
}) => {
  const form = Form.useFormInstance();
  const isViewType = actionType === ActionType.VIEW;
  const { COMBINE_KIT_ISDN_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { orderNo, isOrderd = !isSingleCraft } =
    Form.useWatch((e) => e, form) ?? {};
  const { mutateAsync: mutateProductList, data: productList } =
    useMutateProductList();

  const handleSelectProduct = (option: ProductType) => {
    const { value, label, ...rest } = option as any;
    form.setFieldsValue(rest);
    setSelectedProduct(rest);
  };
  const handleClearProduct = () => {
    form.resetFields([
      'packageProfileCode',
      'bufferPackageCode',
      'profileType',
      'productType',
      'simType',
      'amount',
    ]);
    setSelectedProduct();
  };
  return (
    <>
      <Col span={12}>
        <Form.Item
          label="Sản phẩm"
          name="productName"
          rules={[validateForm.required]}
        >
          <DebounceSelect
            placeholder="Chọn sản phẩm"
            //@ts-ignore
            fetchOptions={orderNo || !isOrderd ? mutateProductList : undefined}
            disabled={isViewType}
            onSelect={(value, option) =>
              handleSelectProduct(option as ProductType)
            }
            onClear={handleClearProduct}
            filter={{ orderId: orderNo?.value }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Loại thuê bao"
          name="isdnType"
          rules={[validateForm.required]}
        >
          <CSelect
            placeholder="Loại thuê bao"
            options={COMBINE_KIT_ISDN_TYPE}
            isLoading={false}
            disabled={isViewType}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="packageProfileCode" label="Gói cước chính">
          <CSelect
            labelInValue
            placeholder="Gói cước chính"
            options={[]}
            disabled
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="bufferPackageCode" label="Gói cước đệm">
          <CSelect
            labelInValue
            placeholder="Gói cước đệm"
            options={[]}
            disabled
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Loại profile"
          name="profileType"
          rules={[validateForm.required]}
        >
          <CSelect
            placeholder="Loại profile"
            options={selectedProduct?.profileTypeList ?? []}
            disabled={isViewType}
          />
        </Form.Item>
      </Col>
    </>
  );
};

export default TypeProduct;
