import CTable from '@react/commons/Table';
import { TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FilterAction } from '../components/FilterAction';
import { getColumnsTableUser } from '../constants';
import {
  useCheckAllowDelete,
  useGetUsers,
  useSupportDeleteUser,
} from '../queryHooks';
import { IUserItem, IUserParams } from '../types';
import { Wrapper } from './styles';

const ListUser = () => {
  const [searchParams] = useSearchParams();
  const listRoles = useRolesByRouter();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { mutate: deleteUser } = useSupportDeleteUser();
  const { mutate: checkAllowDelete } = useCheckAllowDelete((id) => {
    deleteUser(id);
  });

  const { data: listUser, isLoading: loadingTable } = useGetUsers(
    queryParams<IUserParams>(params)
  );

  const handleAction = useCallback(
    (action: ACTION_MODE_ENUM, record: IUserItem) => {
      switch (action) {
        case ACTION_MODE_ENUM.VIEW:
          navigate(pathRoutes.userManagerView(record.id));
          return;
        case ACTION_MODE_ENUM.CREATE:
          navigate(pathRoutes.userManagerAdd);
          return;
        case ACTION_MODE_ENUM.EDIT:
          navigate(pathRoutes.userManagerEdit(record.id));
          return;
      }
    },
    []
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
    [deleteUser]
  );

  const columns: ColumnsType<IUserItem> = useMemo(() => {
    return getColumnsTableUser(params, listRoles, {
      onAction: handleAction,
      onDelete: handleDelete,
    });
  }, [params, listRoles, handleAction, handleDelete]);

  return (
    <Wrapper id="wrapperAccountsManager">
      <TitleHeader id="filterAccountsManager">Tài khoản nhân sự</TitleHeader>
      <div className="flex flex-col">
        <FilterAction />
        <Row>
          <CTable
            columns={columns}
            dataSource={listUser?.content ?? []}
            loading={loadingTable}
            rowKey={'id'}
            pagination={{
              total: listUser?.totalElements,
            }}
          />
        </Row>
      </div>
    </Wrapper>
  );
};
export default ListUser;
