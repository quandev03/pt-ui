import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from '../../../../routers/url';
import useConfigAppStore from '../../../Layouts/stores';
import { useGetTableList } from '../../hooks/useGetTableList';
import {
  useCheckAllowDelete,
  useGetUsers,
  useSupportDeleteUser,
} from '../../hooks';
import { IUserItem, IUserParams } from '../../types';
import {
  CButtonAdd,
  ModalConfirm,
  decodeSearchParams,
  formatQueryParams,
  usePermissions,
  FilterItemProps,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';

export const useLogicListUser = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { mutate: deleteUser } = useSupportDeleteUser();
  const { mutate: checkAllowDelete } = useCheckAllowDelete((id) => {
    deleteUser(id);
  });
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: listUser, isLoading: loadingTable } = useGetUsers(
    formatQueryParams<IUserParams>(params)
  );

  const handleDelete = useCallback(
    (record: IUserItem) => {
      ModalConfirm({
        title: 'Bạn có chắc chắn muốn Xóa bản ghi không?',
        message: 'Các dữ liệu liên quan cũng sẽ bị xóa',
        handleConfirm: () => {
          checkAllowDelete(record.id);
        },
      });
    },
    [checkAllowDelete]
  );

  const columns: ColumnsType<IUserItem> = useGetTableList();

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.systemUserManagerAdd);
  }, [navigate]);

  const actionComponent = useMemo(() => {
    return (
      <div>{permission.canCreate && <CButtonAdd onClick={handleAdd} />}</div>
    );
  }, [handleAdd, permission.canCreate]);

  const filters: FilterItemProps[] = useMemo(() => {
    return [];
  }, []);

  return {
    listUser,
    loadingTable,
    columns,
    actionComponent,
    filters,
    handleDelete,
  };
};
