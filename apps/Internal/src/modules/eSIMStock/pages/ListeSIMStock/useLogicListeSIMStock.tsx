import { useMemo, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  CButton,
  CButtonAdd,
  ModalConfirm,
  decodeSearchParams,
  FilterItemProps,
  formatDateTime,
  formatQueryParams,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import { useGetAllOrganizationUnit } from 'apps/Internal/src/hooks/useGetAllPartners';
import {
  useGetAllPackage,
  useGetPartnerPackageSubscriptions,
  useStopPartnerPackageSubscription,
} from '../../hooks';
import {
  IPackage,
  IPartnerPackageSubscription,
  IPartnerPackageSubscriptionParams,
} from '../../types';
const STATUS_TAG_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'default',
  EXPIRED: 'orange',
};

export const useLogicListeSIMStock = () => {
  const [stoppingId, setStoppingId] = useState<string>();
  const [openCreate, setOpenCreate] = useState(false);
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: listPackage } = useGetAllPackage();
  const formattedParams = formatQueryParams<IPartnerPackageSubscriptionParams>(
    params
  );
  const {
    data: subscriptionList,
    isLoading: loadingTable,
    refetch,
  } = useGetPartnerPackageSubscriptions(formattedParams);

  const { data: agencyOptions = [] } = useGetAllOrganizationUnit();
  const filters: FilterItemProps[] = useMemo(() => {
    const packageOptions =
      listPackage?.map((pkg: IPackage) => ({
        label: pkg.pckName,
        value: pkg.id,
      })) || [];
    const statusOptions = [
      { label: 'Tất cả', value: '' },
      { label: 'Đang hoạt động', value: 'ACTIVE' },
      { label: 'Tạm dừng', value: 'INACTIVE' },
      { label: 'Hết hạn', value: 'EXPIRED' },
    ];
    return [
      {
        label: 'Đối tác',
        type: 'TreeSelect',
        name: 'organizationUnitId',
        showDefault: true,
        treeData: agencyOptions,
        placeholder: 'Đối tác',
        showSearch: true,
      },
      {
        label: 'Gói dịch vụ',
        type: 'Select',
        name: 'packageProfileId',
        showDefault: true,
        options: packageOptions,
        placeholder: 'Chọn gói dịch vụ',
      },
      {
        label: 'Trạng thái',
        type: 'Select',
        name: 'status',
        options: statusOptions,
        placeholder: 'Chọn trạng thái',
        showSearch: false,
      },
    ];
  }, [agencyOptions, listPackage]);

  const { mutate: stopSubscription, isPending: stopping } =
    useStopPartnerPackageSubscription(() => {
      refetch();
      setStoppingId(undefined);
    });

  const handleStop = useCallback(
    (record: IPartnerPackageSubscription) => {
      ModalConfirm({
        title: 'Xác nhận',
        message: `Bạn có chắc muốn dừng gói ${record.packageProfileName}?`,
        handleConfirm: () => {
          setStoppingId(record.id);
          stopSubscription(record.id, {
            onSettled: () => setStoppingId(undefined),
          });
        },
    });
    },
    [stopSubscription]
  );

  const columns: ColumnsType<IPartnerPackageSubscription> = useMemo(() => {
    return [
      {
        title: 'STT',
        width: 60,
        align: 'left',
        render: (_, __, index) => {
    return (
            <span>{index + 1 + (params.page ?? 0) * (params.size ?? 10)}</span>
          );
        },
      },
      {
        title: 'Đối tác',
        dataIndex: 'organizationUnitName',
        width: 220,
        render: (value) => <span>{value}</span>,
      },
      {
        title: 'Gói dịch vụ',
        dataIndex: 'packageProfileName',
        width: 220,
        render: (_, record) => (
          <div className="flex flex-col">
            <span>{record.packageProfileName}</span>
            <span className="text-xs text-gray-500">
              {record.packageProfileCode}
            </span>
      </div>
        ),
      },
      {
        title: 'Bắt đầu',
        dataIndex: 'startTime',
        width: 160,
        render: (value) =>
          value ? dayjs(value).format(formatDateTime) : '--',
      },
      {
        title: 'Kết thúc',
        dataIndex: 'endTime',
        width: 160,
        render: (value) =>
          value ? dayjs(value).format(formatDateTime) : '--',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 140,
        render: (value) => (
          <Tag color={STATUS_TAG_COLORS[value] ?? 'default'}>{value}</Tag>
        ),
      },
      {
        title: 'Thao tác',
        align: 'center',
        width: 150,
        fixed: 'right',
        render: (_, record) => {
          if (record.status !== 'ACTIVE') {
            return null;
          }
          const loading = stopping && stoppingId === record.id;
          return (
            <CButton
              type="primary"
              danger
              onClick={() => handleStop(record)}
              disabled={loading}
              loading={loading}
            >
              Dừng
            </CButton>
          );
        },
      },
    ];
  }, [handleStop, params.page, params.size, stopping, stoppingId]);

  const handleAddService = useCallback(() => {
    setOpenCreate(true);
  }, []);

  const actionComponent = useMemo(() => {
    return <CButtonAdd onClick={handleAddService}>Thêm dịch vụ</CButtonAdd>;
  }, [handleAddService]);

  const handleCloseCreateModal = useCallback(() => {
    setOpenCreate(false);
  }, []);

  return {
    listeSIMStock: subscriptionList,
    loadingTable,
    columns,
    filters,
    actionComponent,
    openCreate,
    closeCreateModal: handleCloseCreateModal,
    refreshList: refetch,
  };
};
