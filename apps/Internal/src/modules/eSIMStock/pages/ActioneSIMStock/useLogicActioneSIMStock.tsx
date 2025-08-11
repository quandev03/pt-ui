import { ColumnsType } from 'antd/es/table';
import { IeSIMStockDetail } from '../../types';
import { useGetDetaileSIMStock } from '../../hooks';
import { useGetTableDetail } from '../../hooks/useGetTableDetail';
import { Form } from 'antd';

export const useLogicActioneSIMStock = (id: string) => {
  const { data: listeSIMDetail, isLoading: loadingTable } =
    useGetDetaileSIMStock(id);

  const columns: ColumnsType<IeSIMStockDetail> = useGetTableDetail();
  const [form] = Form.useForm();

  return {
    listeSIMDetail,
    loadingTable,
    columns,
    form,
  };
};
