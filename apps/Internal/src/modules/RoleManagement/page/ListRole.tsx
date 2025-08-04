import {
  ActionsTypeEnum,
  CButtonAdd,
  CInput,
  decodeSearchParams,
  formatQueryParams,
  IModeAction,
  LayoutList,
  ModalConfirm,
} from '@vissoft-react/common';
import { Form, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { pathRoutes } from 'apps/Internal/src/routers';
import { includes } from 'lodash';
import { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getColumnsTableRole } from '../constants';
import { useGetRoles, useSupportDeleteRole } from '../hooks';
import { IRoleItem, IRoleParams, PropsRole } from '../types';
import { useFilters } from '../hooks/useFilters';

export const ListRole: FC<PropsRole> = memo(({ isPartner }) => {
  const actionByRole = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(params);
  }, [pathname]);

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
    [navigate]
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
    [deleteRole]
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
    return getColumnsTableRole(params, actionByRole, {
      onAction: handleAction,
      onDelete: handleDeleteRole,
    });
  }, [params, actionByRole, handleAction, handleDeleteRole]);
  const actionComponent = useMemo(() => {
    return (
      <CButtonAdd
        onClick={handleAddRole}
        disabled={!includes(actionByRole, ActionsTypeEnum.CREATE)}
      />
    );
  }, [handleAddRole]);
  return (
    <>
      <LayoutList
        title={
          isPartner ? 'Vai trò & Phân quyền đối tác' : 'Vai Trò & Phân Quyền'
        }
        filterItems={filters}
        loading={loadingTable}
        columns={columns}
        data={listRole}
        searchComponent={
          <Tooltip title="Nhập mã hoặc tên vai trò" placement="right">
            <Form.Item name="q" className="min-w-72">
              <CInput maxLength={100} placeholder="Nhập mã hoặc tên vai trò" />
            </Form.Item>
          </Tooltip>
        }
        actionComponent={actionComponent}
      />
    </>
  );
});
