import {
  CButtonAdd,
  decodeSearchParams,
  FilterItemProps,
  IModeAction,
  LayoutList,
  StatusEnum,
  usePermissions,
} from '@vissoft-react/common';
import { pathRoutes } from '../../../routers/url';

import { ColumnsType } from 'antd/es/table';
import { useCallback, useMemo } from 'react';
import {
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import useConfigAppStore from '../../Layouts/stores';
import { useGetOrganizationUsersByOrgCode } from '../hook';
import { useColumnsTableUserManagement } from '../hook/useColumnsTableUserManagement';
import { IUserPartnerCatalog } from '../types';

export const PartnerCatalogUserManagement = () => {
  const { menuData } = useConfigAppStore();
  const permissions = usePermissions(menuData);
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { orgCode } = useParams<{ orgCode: string }>();
  const orgName = params.orgName;

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
        tooltip: orgName,
        defaultValue: orgName,
        value: orgName,
      },
    ];
  }, [orgName]);
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
