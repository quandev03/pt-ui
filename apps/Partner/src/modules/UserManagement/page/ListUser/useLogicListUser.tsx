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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetUsers, useSupportDeleteUser } from '../../hooks';
import useConfigAppStore from '../../../Layouts/stores';
import { useCallback, useMemo } from 'react';
import { pathRoutes } from '../../../../../src/routers';
import { useGetTableList } from '../../hooks/useGetTableList';
import { STATUS_OPTIONS } from '../../../../../src/constants';
import { useGetAgencyOptions } from '../../../../../src/hooks/useGetAgencyOptions';

export const useLogicListUser = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { mutate: deleteUser } = useSupportDeleteUser();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: listUser, isLoading: loadingTable } = useGetUsers(
    formatQueryParams<IUserParams>(params)
  );
  const { data: agencyOptions = [] } = useGetAgencyOptions();
  const handleDelete = useCallback(
    (record: IUserItem) => {
      ModalConfirm({
        message: 'Bạn có chắc chắn muốn Xóa bản ghi không?',
        handleConfirm: () => {
          deleteUser(record.id);
        },
      });
    },
    [deleteUser]
  );

  const columns: ColumnsType<IUserItem> = useGetTableList();

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.userManagerAdd);
  }, [navigate]);

  const actionComponent = useMemo(() => {
    return (
      <div>{permission.canCreate && <CButtonAdd onClick={handleAdd} />}</div>
    );
  }, [handleAdd, permission.canCreate]);

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'TreeSelect',
        name: 'orgId',
        label: 'Đại lý',
        placeholder: 'Đại lý',
        treeData: agencyOptions,
      },
      {
        type: 'Select',
        name: 'status',
        label: 'Trạng thái',
        placeholder: 'Trạng thái',
        options: STATUS_OPTIONS,
      },
    ];
  }, [agencyOptions]);

  return {
    listUser,
    loadingTable,
    columns,
    actionComponent,
    filters,
    handleDelete,
  };
};
