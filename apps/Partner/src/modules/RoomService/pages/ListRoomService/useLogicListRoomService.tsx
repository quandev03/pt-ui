import {
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  usePermissions,
  CButtonAdd,
} from '@vissoft-react/common';
import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useColumnsRoomServiceList } from '../../hooks/useColumnsRoomServiceList';
import { IRoomService, IRoomServiceParams } from '../../types';
import { ColumnsType } from 'antd/es/table';
import {
  useGetRoomServiceList,
  useDeleteRoomService,
} from '../../hooks';
import { ServiceTypeOptions } from '../../constants/enum';
import useConfigAppStore from '../../../Layouts/stores';
import { pathRoutes } from '../../../../routers';
import { STATUS_OPTIONS } from '../../../../constants';

export const useLogicListRoomService = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { data: roomServiceList, isLoading: loadingRoomServiceList } =
    useGetRoomServiceList(formatQueryParams<IRoomServiceParams>(params));
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);

  const handleViewDetails = useCallback(
    (record: IRoomService) => {
      navigate(pathRoutes.roomServiceView(record.id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (record: IRoomService) => {
      navigate(pathRoutes.roomServiceEdit(record.id));
    },
    [navigate]
  );

  const handleDelete = useCallback((record: IRoomService) => {
    // Delete logic is handled in useColumnsRoomServiceList
  }, []);

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.roomServiceAdd);
  }, [navigate]);

  const columns: ColumnsType<IRoomService> = useColumnsRoomServiceList({
    onViewDetails: handleViewDetails,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'Select',
        name: 'serviceType',
        label: 'Loại dịch vụ',
        placeholder: 'Chọn loại dịch vụ',
        options: ServiceTypeOptions,
      },
      {
        type: 'Select',
        name: 'status',
        label: 'Trạng thái',
        placeholder: 'Chọn trạng thái',
        options: STATUS_OPTIONS,
      },
    ];
  }, []);

  const actionComponent = useMemo(() => {
    return (
      <div>
        {permission.canCreate && (
          <CButtonAdd onClick={handleAdd}>Thêm dịch vụ</CButtonAdd>
        )}
      </div>
    );
  }, [permission.canCreate, handleAdd]);

  return {
    columns,
    filters,
    roomServiceList,
    loadingRoomServiceList,
    actionComponent,
  };
};

