import { handleKeyDowNumber } from '@react/helpers/utils';
import { InputNumber } from 'antd';
import React, { memo, useCallback } from 'react';
import useOrderStore from '../stores';
import { cloneDeep, debounce } from 'lodash';
import { useSupportGetCalculateDiscount } from '../queryHooks';
import useActionMode from '@react/hooks/useActionMode';
import { ACTION_MODE_ENUM } from '@react/commons/types';

interface TotalAmountCellProps {
  index: number;
  defaultValue: number;
}

const QuantityInput: React.FC<TotalAmountCellProps> = ({
  index,
  defaultValue,
}) => {
  const actionMode = useActionMode();
  const {
    productSelected,
    calculateInfo,
    setCalculateInfo,
    setProductSelected,
  } = useOrderStore();
  const { mutate: getCalculateDiscountAction } = useSupportGetCalculateDiscount(
    (data) => {
      setCalculateInfo(data);
      setProductSelected(data.orderDetailInfos);
    }
  );
  const debouncedOnChange = useCallback(
    debounce((value) => {
      const newProductSelected = cloneDeep(productSelected).map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            quantity: value ?? 0,
          };
        }
        return item;
      });

      const isNoCall = newProductSelected.some(
        (item) => !item.productId || !item.quantity
      );
      if (!isNoCall) {
        getCalculateDiscountAction({
          orderDetailInfos: newProductSelected,
          amountAdditionalDiscount:
            calculateInfo?.amountAdditionalDiscount ?? 0,
        });
      } else {
        setProductSelected(newProductSelected);
      }
    }, 500),
    [productSelected]
  );

  const handleChangeProduct = useCallback(
    (value: number | null) => {
      debouncedOnChange(value);
    },
    [debouncedOnChange]
  );

  return (
    <InputNumber
      onKeyDown={handleKeyDowNumber}
      placeholder="Nhập số lượng"
      parser={(value) => {
        return value ? Number(value.replace(/\D/g, '')) : 0;
      }}
      defaultValue={defaultValue}
      onChange={handleChangeProduct}
      controls={false}
      disabled={actionMode === ACTION_MODE_ENUM.VIEW}
    />
  );
};

export default memo(QuantityInput);
