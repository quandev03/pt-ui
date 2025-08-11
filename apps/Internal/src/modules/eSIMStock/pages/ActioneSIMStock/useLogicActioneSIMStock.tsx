import { ColumnsType } from 'antd/es/table';
import { IeSIMStockDetail } from '../../types';
import { useGetDetaileSIMStock } from '../../hooks';
import { useGetTableDetail } from '../../hooks/useGetTableDetail';

export const useLogicActioneSIMStock = (id: string) => {
  const { data: listeSIMDetail, isLoading: loadingTable } =
    useGetDetaileSIMStock(id);

  const columns: ColumnsType<IeSIMStockDetail> = useGetTableDetail();

  return {
    listeSIMDetail,
    loadingTable,
    columns,
  };
};
