import {
  CButtonAdd,
  FilterItemProps,
  formatDateBe,
  usePermissions,
} from '@vissoft-react/common';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { pathRoutes } from '../../../../routers/url';
import useConfigAppStore from '../../../Layouts/stores';

export const useLogicListUploadNumber = () => {
  // const [searchParams] = useSearchParams();
  // const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  // const { data: listUser, isLoading: loadingTable } = useGetUsers(
  //   formatQueryParams<IUserParams>(params)
  // );

  // const columns: ColumnsType<IUserItem> = useGetTableList();
  const today = dayjs().endOf('day');
  const startDate = today.subtract(29, 'day').startOf('day');
  const handleAdd = useCallback(() => {
    navigate(pathRoutes.systemUserManagerAdd);
  }, [navigate]);

  const actionComponent = useMemo(() => {
    return (
      <div>{permission.canCreate && <CButtonAdd onClick={handleAdd} />}</div>
    );
  }, [handleAdd, permission.canCreate]);

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'DateRange',
        name: 'createdAt',
        label: 'Ngày tạo',
        keySearch: ['createdAtFrom', 'createdAtTo'],
        formatSearch: formatDateBe,
        placeholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
        showDefault: true,
        format: 'DD/MM/YYYY',
        defaultValue: [startDate, today],
        disabledFutureDate: true,
      },
    ];
  }, [startDate, today]);

  return {
    // listUser,
    // loadingTable,
    // columns,
    actionComponent,
    filters,
    // handleDelete,
  };
};
