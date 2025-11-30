import {
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  usePermissions,
  CButtonAdd,
} from '@vissoft-react/common';
import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useColumnsContractList } from '../../hooks/useColumnsContractList';
import { IContract, IContractParams } from '../../types';
import { ColumnsType } from 'antd/es/table';
import { useGetContractList } from '../../hooks';
import useConfigAppStore from '../../../Layouts/stores';
import { pathRoutes } from '../../../../routers';
import { useGetAgencyOptions } from '../../../../hooks/useGetAgencyOptions';

export const useLogicListContract = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { data: contractList, isLoading: loadingContractList } =
    useGetContractList(formatQueryParams<IContractParams>(params));
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: agencyOptions = [] } = useGetAgencyOptions();

  const handleViewDetails = useCallback(
    (record: IContract) => {
      navigate(pathRoutes.contractManagementDetail(record.id));
    },
    [navigate]
  );

  const handleAddNew = useCallback(() => {
    navigate(pathRoutes.contractManagementAdd);
  }, [navigate]);

  const columns: ColumnsType<IContract> = useColumnsContractList({
    onViewDetails: handleViewDetails,
  });

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'TreeSelect',
        name: 'roomId',
        label: 'Phòng',
        placeholder: 'Chọn phòng',
        treeData: agencyOptions,
      },
      {
        type: 'DatePicker',
        name: 'startDate',
        label: 'Từ ngày',
        placeholder: 'Chọn ngày bắt đầu',
      },
      {
        type: 'DatePicker',
        name: 'endDate',
        label: 'Đến ngày',
        placeholder: 'Chọn ngày kết thúc',
      },
    ];
  }, [agencyOptions]);

  const actionComponent = useMemo(() => {
    return (
      <div className="flex gap-2">
        {permission.canCreate && (
          <CButtonAdd onClick={handleAddNew}>Thêm hợp đồng mới</CButtonAdd>
        )}
      </div>
    );
  }, [permission.canCreate, handleAddNew]);

  // LayoutList expects data to be IPage format, which includes content array
  // The data from useGetContractList is already IPage<IContract>
  return {
    columns,
    filters,
    contractList, // This is IPage<IContract> with content array
    loadingContractList,
    actionComponent,
  };
};

