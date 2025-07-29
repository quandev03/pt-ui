import CSelect from '@react/commons/Select';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import useActionMode from '@react/hooks/useActionMode';
import { Form } from 'antd';
import validateForm from 'apps/Partner/src/utils/validator';
import { cloneDeep, debounce } from 'lodash';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  useInfinityScrollProduct,
  useSupportGetCalculateDiscount,
} from '../queryHooks';
import useOrderStore from '../stores';
import { IParamsProduct, IPreferentialLine, IProductInOrder } from '../types';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

interface TotalAmountCellProps {
  index: number;
}

const SelectProduct: React.FC<TotalAmountCellProps> = ({ index }) => {
  const actionMode = useActionMode();
  const { calculateInfo, setCalculateInfo, orderDetail, setShowValidDiscount } =
    useOrderStore();

  const formInstance = useFormInstance();
  const [params, setParams] = useState<IParamsProduct>({
    page: 0,
    size: 20,
    query: '',
  });

  const products = useWatch<IProductInOrder[]>('products', formInstance) ?? [];

  const {
    data: productsList = [],
    fetchNextPage: productFetchNextPage,
    hasNextPage: productHasNextPage,
  } = useInfinityScrollProduct(params);

  const calculateProductDiscounts = (
    product: IProductInOrder,
    preferentialLines: IPreferentialLine[]
  ) => {
    const productPreferentialLines = preferentialLines.filter(
      (item) => item.productId === product.productId
    );

    return {
      packageDiscountAmount:
        productPreferentialLines.find((item) => item.discountType === 1)
          ?.amount ?? 0,
      simDiscountAmount:
        productPreferentialLines.find((item) => item.discountType === 2)
          ?.amount ?? 0,
    };
  };

  const { mutate: getCalculateDiscountAction } = useSupportGetCalculateDiscount(
    (data) => {
      const isDiscountValid =
        data.amountAdditionalDiscount > data.amountProduct;
      setShowValidDiscount(isDiscountValid);

      const updatedProducts = data.orderDetailInfos.map((product) => {
        const currentProduct = products.find(
          (item) => item?.productId === product?.productId
        );

        const discounts = calculateProductDiscounts(
          product,
          data.preferentialLines
        );

        return {
          ...currentProduct,
          ...product,
          amountTotal: product?.amountTotal ?? currentProduct?.amountTotal,
          amountDiscount:
            product?.amountDiscount ?? currentProduct?.amountDiscount,
          ...discounts,
        };
      });

      formInstance.setFieldValue('products', updatedProducts);
      setCalculateInfo(data);
    }
  );

  const optionTable = useMemo(() => {
    const productSelectedIds = products.map((item) => item.productId);
    if (
      actionMode === ACTION_MODE_ENUM.VIEW &&
      orderDetail &&
      orderDetail?.saleOrderLines &&
      orderDetail?.saleOrderLines.length > 0
    ) {
      return orderDetail?.saleOrderLines.map((item) => ({
        value: item.productId,
        label: item.productName,
        disabled: productSelectedIds.includes(item.productId),
      }));
    }
    if (productsList) {
      return productsList.map((item) => ({
        value: item.productId,
        label: item.productName,
        disabled: productSelectedIds.includes(item.productId),
      }));
    }
    return [];
  }, [actionMode, orderDetail, products, productsList]);

  const handleChangeProduct = (value: string) => {
    const productSelect = productsList.find(
      (item) => item.productId === Number(value)
    );
    const productOnTable = products.find((_, idx) => index === idx);

    if (productSelect && productOnTable) {
      const newProducts = cloneDeep(products);
      newProducts[index] = {
        ...productOnTable,
        ...productSelect,
      };
      formInstance.setFieldValue('products', newProducts);

      if (productOnTable.quantity) {
        getCalculateDiscountAction({
          orderDetailInfos: newProducts,
          amountAdditionalDiscount:
            calculateInfo?.amountAdditionalDiscount ?? 0,
        });
      }
    }
  };

  const handleSearch = debounce((value: string) => {
    setParams({
      ...params,
      query: value,
      page: 0,
    });
  }, 500);
  const handleScrollDatasets = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (productHasNextPage) {
          productFetchNextPage();
        }
      }
    },
    [productHasNextPage, productFetchNextPage]
  );

  return (
    <Form.Item
      name={[index, 'productName']}
      rules={[validateForm.required]}
      validateTrigger={['onSubmit']}
    >
      <CSelect
        placeholder="Chọn sản phẩm"
        className={`!w-[200px]`}
        options={optionTable}
        onPopupScroll={handleScrollDatasets}
        onSearch={handleSearch}
        onChange={handleChangeProduct}
        allowClear={false}
        disabled={actionMode === ACTION_MODE_ENUM.VIEW}
        filterOption={false}
      />
    </Form.Item>
  );
};

export default memo(SelectProduct);
