import {
  CButtonAdd,
  decodeSearchParams,
  formatQueryParams,
  usePermissions,
  FilterItemProps,
} from '@vissoft-react/common';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetAdvertisementList } from '../../hooks';
import useConfigAppStore from '../../../Layouts/stores';
import { useCallback, useMemo } from 'react';
import { pathRoutes } from '../../../../../src/routers';
import { IAdvertisementParams } from '../../types';
import { useColumnsAdvertisementList } from './useColumnsAdvertisementList';
import { AdvertisementStatusOptions } from '../../constants/enum';

export const useLogicListAdvertisement = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: advertisementList, isLoading: loadingTable } =
    useGetAdvertisementList(formatQueryParams<IAdvertisementParams>(params));

  const columns = useColumnsAdvertisementList();

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.advertisementManagementAdd);
  }, [navigate]);

  const actionComponent = useMemo(() => {
    return (
      <div>{permission.canCreate && <CButtonAdd onClick={handleAdd} />}</div>
    );
  }, [handleAdd, permission.canCreate]);

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'Select',
        name: 'status',
        label: 'Trạng thái',
        placeholder: 'Chọn trạng thái',
        options: AdvertisementStatusOptions,
      },
    ];
  }, []);

  return {
    advertisementList,
    loadingTable,
    columns,
    actionComponent,
    filters,
  };
};

