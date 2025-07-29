import CSelect from '@react/commons/Select';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import useActionMode from '@react/hooks/useActionMode';
import React, { memo, useMemo } from 'react';
import useOrderStore from '../stores';

interface TotalAmountCellProps {
  index: number;
}

const SelectProduct: React.FC<TotalAmountCellProps> = ({ index }) => {
  const actionMode = useActionMode();
  const { productSelected } = useOrderStore();

  const productSelectedIds = useMemo(() => {
    return productSelected.map((item) => item.productId);
  }, [productSelected]);

  const optionTable = useMemo(() => {
    if (productSelected) {
      return productSelected.map((item) => ({
        value: item.productId,
        label: item.productName,
      }));
    }
    return [];
  }, [productSelected]);

  return (
    <CSelect
      placeholder="Chọn sản phẩm"
      className="w-full"
      options={optionTable}
      defaultValue={productSelectedIds[index]}
      disabled={actionMode === ACTION_MODE_ENUM.VIEW}
      filterOption={false}
    />
  );
};

export default memo(SelectProduct);
