import {
  decodeSearchParams,
  IModeAction,
  usePermissions,
  CButtonAdd,
  CButtonExport,
  formatQueryParams,
  LayoutList,
  FilterItemProps,
  StatusEnum,
} from '@vissoft-react/common';
import { pathRoutes } from '../../../routers/url';

import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo } from 'react';
import {
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { IUserPartnerCatalog } from '../types';
import { notification } from 'antd';
import useConfigAppStore from '../../Layouts/stores';
import { useColumnsTableUserManagement } from '../hook/useColumnsTableUserManagement';
import {
  useGetDetailByCode,
  useGetOrganizationUsersByOrgCode,
} from '../queryHooks';

export const PartnerCatalogUserManagement = () => {
  const { menuData } = useConfigAppStore();
  const permissions = usePermissions(menuData);
  const { orgCode } = useParams<{ orgCode: string }>();

  const { data: detailPartner } = useGetDetailByCode(orgCode ?? '');

  const filtersItem: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'Select',
        name: 'status',
        label: 'Trạng thái',
        placeholder: 'Trạng thái',
        options: [
          {
            label: 'Hoạt động',
            value: StatusEnum.ACTIVE.toString(),
          },
          {
            label: 'Không hoạt động',
            value: StatusEnum.INACTIVE.toString(),
          },
        ],
      },
      {
        type: 'Input',
        name: 'orgName',
        label: 'Đối tác',
        disabled: true,
        showDefault: true,
        tooltip: detailPartner?.orgName,
        defaultValue: detailPartner?.orgName,
        value: detailPartner?.orgName,
      },
    ];
  }, [detailPartner?.orgName]);
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { filters, requestTime, ...rest } = params;

  const { data: listUser, isLoading } = useGetOrganizationUsersByOrgCode(
    orgCode ?? '',
    rest
  );

  const navigation = useNavigation();
  const navigate = useNavigate();
  const loadingTable = navigation.state === 'loading';

  const handleAction = useCallback(
    (action: IModeAction, record: IUserPartnerCatalog) => {
      switch (action) {
        case IModeAction.UPDATE:
          navigate(pathRoutes.partnerCatalogUserEdit(orgCode ?? '', record.id));
          break;
        case IModeAction.READ:
          navigate(pathRoutes.partnerCatalogUserView(orgCode ?? '', record.id));
          break;
      }
    },
    [navigate, orgCode]
  );

  const columns: ColumnsType<IUserPartnerCatalog> =
    useColumnsTableUserManagement({
      onAction: handleAction,
    });

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.partnerCatalogUserAdd(orgCode));
  }, [navigate, orgCode]);

  const actionComponent = useMemo(() => {
    return (
      <div className="flex gap-4">
        {permissions.canCreate && (
          <CButtonAdd type="primary" onClick={handleAdd} />
        )}
      </div>
    );
  }, [handleAdd, permissions.canCreate]);

  const searchComponent = useMemo(() => {
    return (
      <LayoutList.SearchComponent
        name="q"
        tooltip="Nhập họ và tên hoặc username để tìm kiếm"
        placeholder="Nhập họ và tên hoặc username để tìm kiếm"
      />
    );
  }, []);

  return (
    <LayoutList
      actionComponent={actionComponent}
      data={listUser}
      columns={columns}
      title="Danh sách user"
      filterItems={filtersItem}
      loading={loadingTable || isLoading}
      searchComponent={searchComponent}
    />
  );
};
