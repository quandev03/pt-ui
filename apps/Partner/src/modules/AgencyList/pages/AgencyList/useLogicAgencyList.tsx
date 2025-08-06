import {
  CButtonAdd,
  FilterItemProps,
  ModalConfirm,
  decodeSearchParams,
  formatQueryParams,
  usePermissions,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from '../../../../routers';
import useConfigAppStore from '../../../Layouts/stores';
import { IAgency, IAgencyParams } from '../../types';
import { useGetTableList } from '../../hooks/useGetTableList';
import { useGetAgencies, useSupportDeleteAgency } from '../../hooks';
import { STATUS_OPTIONS } from '../../../../../src/constants';

export const useLogicListAgency = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { mutate: deleteAgency } = useSupportDeleteAgency();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: listAgency, isLoading: loadingTable } = useGetAgencies(
    formatQueryParams<IAgencyParams>({
      ...params,
      page: undefined,
      size: undefined,
    })
  );

  const handleDelete = useCallback(
    (record: IAgency) => {
      ModalConfirm({
        message: 'Bạn có chắc chắn muốn Xóa bản ghi không?',
        handleConfirm: () => {
          deleteAgency(record.id + '');
        },
      });
    },
    [deleteAgency]
  );

  const columns: ColumnsType<IAgency> = useGetTableList();

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.agencyAdd);
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
        placeholder: 'Trạng thái',
        options: STATUS_OPTIONS,
      },
    ];
  }, []);

  return {
    listAgency,
    loadingTable,
    columns,
    actionComponent,
    filters,
    handleDelete,
  };
};
