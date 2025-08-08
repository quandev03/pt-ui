import {
  ActionsTypeEnum,
  AnyElement,
  CButtonAdd,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  IModeAction,
  LayoutList,
  MESSAGE,
  ModalConfirm,
  StatusEnum,
  usePermissions,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { ColumnsType } from 'antd/es/table';
import includes from 'lodash/includes';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from '../../../routers';
import { getColumnUserGroup } from '../constants';
import { useGetGroupUsers, useSupportDeleteGroup } from '../queryHook';
import { IGroupUserParams, IUserGroup } from '../types';
import useConfigAppStore from '../../Layouts/stores';

export const ListUserGroup = () => {
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data, isLoading: loadingTable } = useGetGroupUsers(
    formatQueryParams<IGroupUserParams>(params)
  );
  const { mutate: deleteGroup } = useSupportDeleteGroup();

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.groupUserManagerAdd);
  }, [navigate]);

  const handleDeleteItem = useCallback(
    (id: string) => {
      if (id) {
        ModalConfirm({
          message: MESSAGE.G05,
          handleConfirm: () => {
            deleteGroup(id);
          },
        });
      }
    },
    [deleteGroup]
  );

  const openModalEditView = useCallback(
    (type: IModeAction, record: IUserGroup) => {
      switch (type) {
        case IModeAction.READ:
          navigate(pathRoutes.groupUserManagerView(record.id));
          return;
        case IModeAction.CREATE:
          navigate(pathRoutes.groupUserManagerAdd);
          return;
        case IModeAction.UPDATE:
          navigate(pathRoutes.groupUserManagerEdit(record.id));
          return;
      }
    },
    [navigate]
  );

  const columns: ColumnsType<IUserGroup> = useMemo(() => {
    return getColumnUserGroup(params, {
      onAction: (type, record) => {
        openModalEditView(type, record);
      },
      onDelete: (user) => {
        handleDeleteItem(user.id);
      },
    });
  }, [handleDeleteItem, openModalEditView, params]);

  useEffect(() => {
    form.setFieldsValue(params);
  }, [form, params]);
  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'Select',
        name: 'status',
        label: 'Trạng thái',
        options: [
          {
            label: 'Tất cả',
            value: '',
          },
          {
            label: 'Hoạt động',
            value: String(StatusEnum.ACTIVE),
          },
          {
            label: 'Không hoạt động',
            value: String(StatusEnum.INACTIVE),
          },
        ],
        placeholder: 'Chọn trạng thái',
      },
    ];
  }, []);
  const actionComponent = useMemo(() => {
    return (
      <div>{permission.canCreate && <CButtonAdd onClick={handleAdd} />}</div>
    );
  }, [permission.canCreate, handleAdd]);
  return (
    <LayoutList
      filterItems={filters}
      data={(data as AnyElement) ?? []}
      columns={columns}
      title="Nhóm tài khoản"
      loading={loadingTable}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập mã hoặc tên nhóm tài khoản"
          placeholder="Nhập mã hoặc tên nhóm tài khoản"
        />
      }
      actionComponent={actionComponent}
    />
  );
};
