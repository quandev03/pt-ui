import { ColumnsType } from 'antd/es/table';
import { GenderEnum, IeSIMStockDetail } from '../../types';
import { useGetCustomerInfo, useGetDetaileSIMStock } from '../../hooks';
import { useGetTableDetail } from '../../hooks/useGetTableDetail';
import { Form } from 'antd';
import { useEffect } from 'react';

export const useLogicActioneSIMStock = (id: string) => {
  const { data: listeSIMDetail, isLoading: loadingTable } =
    useGetDetaileSIMStock(id);
  const { data: customerInfo } = useGetCustomerInfo(id);

  const columns: ColumnsType<IeSIMStockDetail> = useGetTableDetail();
  const [form] = Form.useForm();
  useEffect(() => {
    if (customerInfo) {
      form.setFieldsValue({
        ...customerInfo,
        gender:
          customerInfo.gender === GenderEnum.MALE
            ? 'Nam'
            : GenderEnum.FEMALE
            ? 'Nữ'
            : '',
      });
    }
  }, [customerInfo, form]);
  return {
    listeSIMDetail,
    loadingTable,
    columns,
    form,
    customerInfo,
  };
};
