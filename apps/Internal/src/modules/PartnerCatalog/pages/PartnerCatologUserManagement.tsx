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
import { useCallback, useMemo } from 'react';
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

export const PartnerCatalogUserManagement = () => {
  const { menuData } = useConfigAppStore();
  const permissions = usePermissions(menuData);

  const filters: FilterItemProps[] = useMemo(() => {
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
        // tooltip: detailUnit?.name,
        // defaultValue: detailUnit?.name,
        // value: detailUnit?.name,
      },
    ];
  }, []);
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { unitId } = useParams<{ unitId: string }>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sampleCollectionUnitName, ...rest } = params;

  // const listUser = useGetAllUserByUnitId({
  //   ...formatQueryParams({
  //     ...rest,
  //     samplingUnitId: unitId,
  //     type: 'sampling_staff',
  //   }),
  // });

  const navigation = useNavigation();
  const navigate = useNavigate();
  const loadingTable = navigation.state === 'loading';

  const handleAction = useCallback(
    (action: IModeAction, record: IUserPartnerCatalog) => {
      switch (action) {
        case IModeAction.UPDATE:
          navigate(pathRoutes.partnerCatalogUserEdit(unitId ?? '', record.id));
          break;
        case IModeAction.READ:
          navigate(pathRoutes.partnerCatalogUserView(unitId ?? '', record.id));
          break;
      }
    },
    [navigate, unitId]
  );

  const columns: ColumnsType<IUserPartnerCatalog> =
    useColumnsTableUserManagement({
      onAction: handleAction,
    });

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.partnerCatalogUserAdd(unitId));
  }, [navigate, unitId]);

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
      data={[]}
      columns={columns}
      title="Danh sách user"
      filterItems={filters}
      loading={
        loadingTable
        // || listUser.isLoading || listUser.isFetching
      }
      searchComponent={searchComponent}
    />
  );
};
