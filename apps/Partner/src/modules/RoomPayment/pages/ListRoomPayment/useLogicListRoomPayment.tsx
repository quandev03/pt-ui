import {
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  usePermissions,
  CButtonAdd,
} from '@vissoft-react/common';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useColumnsRoomPaymentList } from '../../hooks/useColumnsRoomPaymentList';
import { IRoomPayment, IRoomPaymentParams } from '../../types';
import { ColumnsType } from 'antd/es/table';
import { useGetRoomPaymentList } from '../../hooks';
import { MonthOptions, PaymentStatusOptions } from '../../constants/enum';
import useConfigAppStore from '../../../Layouts/stores';
import { pathRoutes } from '../../../../routers';
import { useGetAgencyOptions } from '../../../../hooks/useGetAgencyOptions';

export const useLogicListRoomPayment = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { data: roomPaymentList, isLoading: loadingRoomPaymentList } =
    useGetRoomPaymentList(formatQueryParams<IRoomPaymentParams>(params));
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: agencyOptions = [] } = useGetAgencyOptions();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleViewDetails = useCallback(
    (record: IRoomPayment) => {
      navigate(pathRoutes.roomPaymentDetail(record.id));
    },
    [navigate]
  );

  const handleOpenUpload = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);

  const handleCloseUpload = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  const columns: ColumnsType<IRoomPayment> = useColumnsRoomPaymentList({
    onViewDetails: handleViewDetails,
  });

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'TreeSelect',
        name: 'orgUnitId',
        label: 'Phòng',
        placeholder: 'Chọn phòng',
        treeData: agencyOptions,
      },
      {
        type: 'Select',
        name: 'month',
        label: 'Tháng',
        placeholder: 'Chọn tháng',
        options: MonthOptions,
      },
      {
        type: 'InputNumber',
        name: 'year',
        label: 'Năm',
        placeholder: 'Nhập năm',
      },
      {
        type: 'Select',
        name: 'status',
        label: 'Trạng thái',
        placeholder: 'Chọn trạng thái',
        options: PaymentStatusOptions,
      },
    ];
  }, [agencyOptions]);

  const actionComponent = useMemo(() => {
    return (
      <div className="flex gap-2">
        {permission.canCreate && (
          <>
            <CButtonAdd onClick={handleOpenUpload}>Tạo thanh toán mới</CButtonAdd>
          </>
        )}
      </div>
    );
  }, [permission.canCreate, handleOpenUpload]);

  return {
    columns,
    filters,
    roomPaymentList,
    loadingRoomPaymentList,
    actionComponent,
    isUploadModalOpen,
    handleCloseUpload,
  };
};

