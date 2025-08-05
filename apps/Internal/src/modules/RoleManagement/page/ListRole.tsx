import {
  ActionsTypeEnum,
  CButtonAdd,
  decodeSearchParams,
  formatQueryParams,
  IModeAction,
  LayoutList,
  ModalConfirm,
  usePermissions,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { includes } from 'lodash';
import { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from '../../../routers';
import { useColumnsTableRole } from '../hooks/useColumnsTableRole';
import { useGetRoles, useSupportDeleteRole } from '../hooks';
import { useFilters } from '../hooks/useFilters';
import { IRoleItem, IRoleParams, PropsRole } from '../types';
import useConfigAppStore from '../../Layouts/stores';

export const ListRole: FC<PropsRole> = memo(({ isPartner }) => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { menuData } = useConfigAppStore();
  useEffect(() => {
    form.setFieldsValue(params);
  }, [form, params, pathname]);
  const permission = usePermissions(menuData);
  const handleAction = useCallback(
    (type: IModeAction, record: IRoleItem) => {
      switch (type) {
        case IModeAction.READ:
          if (isPartner) {
            navigate(pathRoutes.rolePartnerManagerView(record.id));
          } else {
            navigate(pathRoutes.roleManagerView(record.id));
          }
          return;
        case IModeAction.CREATE:
          if (isPartner) {
            navigate(pathRoutes.rolePartnerManagerAdd);
          } else {
            navigate(pathRoutes.roleManagerAdd);
          }
          return;
        case IModeAction.UPDATE:
          if (isPartner) {
            navigate(pathRoutes.rolePartnerManagerEdit(record.id));
          } else {
            navigate(pathRoutes.roleManagerEdit(record.id));
          }
          return;
      }
    },
    [isPartner, navigate]
  );

  const { mutate: deleteRole } = useSupportDeleteRole();
  const { data: listRole, isLoading: loadingTable } = useGetRoles(
    formatQueryParams<IRoleParams>({ ...params, isPartner })
  );

  const handleDeleteRole = useCallback(
    (role: IRoleItem) => {
      ModalConfirm({
        title: 'Bạn có chắc chắn muốn Xoá bản ghi không?',
        message: 'Các dữ liệu liên quan cũng sẽ bị xoá',
        handleConfirm: () => {
          deleteRole({
            id: role.id,
            isPartner,
          });
        },
      });
    },
    [deleteRole, isPartner]
  );
  const handleAddRole = useCallback(() => {
    if (isPartner) {
      navigate(pathRoutes.rolePartnerManagerAdd);
    } else {
      navigate(pathRoutes.roleManagerAdd);
    }
  }, [isPartner, navigate]);
  const { filters } = useFilters();
  const columns: ColumnsType<IRoleItem> = useMemo(() => {
    return useColumnsTableRole(params, {
      onAction: handleAction,
      onDelete: handleDeleteRole,
    });
  }, [params, handleAction, handleDeleteRole]);
  const actionComponent = useMemo(() => {
    return (
      <CButtonAdd onClick={handleAddRole} disabled={!permission.canCreate} />
    );
  }, [permission.canCreate, handleAddRole]);
  return (
    <LayoutList
      title={
        isPartner ? 'Vai trò & Phân quyền đối tác' : 'Vai Trò & Phân Quyền'
      }
      filterItems={filters}
      loading={loadingTable}
      columns={columns}
      data={listRole}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập mã hoặc tên vai trò"
          placeholder="Nhập mã hoặc tên vai trò"
          maxLength={100}
        />
      }
      actionComponent={actionComponent}
    />
  );
});
