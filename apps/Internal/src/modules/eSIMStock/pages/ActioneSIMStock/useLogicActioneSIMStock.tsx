import { ColumnsType } from 'antd/es/table';
import { GenderEnum, IeSIMStockDetail } from '../../types';
import { useGetCustomerInfo, useGetDetaileSIMStock } from '../../hooks';
import { useGetTableDetail } from '../../hooks/useGetTableDetail';
import { Form } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';

export const useLogicActioneSIMStock = (id: string) => {
  const { data: listeSIMDetail, isLoading: loadingTable } =
    useGetDetaileSIMStock(id);
  const { data: customerInfo } = useGetCustomerInfo(id);

  const columns: ColumnsType<IeSIMStockDetail> = useGetTableDetail();
  const [form] = Form.useForm();
  useEffect(() => {
    if (customerInfo) {
      let gender = '';
      if (customerInfo.customerCode) {
        if (customerInfo.gender === GenderEnum.MALE) {
          gender = 'Nam';
        } else if (customerInfo.gender === GenderEnum.FEMALE) {
          gender = 'Nữ';
        }
      }
      form.setFieldsValue({
        ...customerInfo,
        gender: gender,
        issueDate: customerInfo.issueDate ? dayjs(customerInfo.issueDate) : '',
        birthOfDate: customerInfo.birthOfDate
          ? dayjs(customerInfo.birthOfDate)
          : '',
        idNoExpireDate: customerInfo.idNoExpireDate
          ? dayjs(customerInfo.idNoExpireDate)
          : '',
        typeDocument: customerInfo.customerCode ? 'Hộ chiếu' : '',
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
