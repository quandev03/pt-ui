import {
  CButton,
  FilterItemProps,
  decodeSearchParams,
  formatQueryParams,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { pathRoutes } from '../../../../routers';
import { useGetPurchaseHistory } from '../../hooks';
import { IPurchaseHistoryItem, IPurchaseHistoryParams } from '../../types';

const formatDate = (value?: string) => {
  if (!value) return '--';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm') : '--';
};

const renderStatus = (status?: string) => {
  if (!status) {
    return <Tag color="default">Không xác định</Tag>;
  }
  const normalized = status.toString().toUpperCase();
  switch (normalized) {
    case 'ACTIVE':
    case '1':
      return <Tag color="success">Đang hiệu lực</Tag>;
    case 'INACTIVE':
    case '0':
      return <Tag color="default">Hết hiệu lực</Tag>;
    default:
      return <Tag color="processing">{status}</Tag>;
  }
};

export const useLogicBuyPackageServiceList = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const queryParams = formatQueryParams<IPurchaseHistoryParams>(params);
  const { data, isLoading } = useGetPurchaseHistory(queryParams);

  const packageFilterOptions = useMemo(() => {
    const map = new Map<string, { label: string; value: string }>();
    (data?.content ?? []).forEach((item) => {
      const key = item.packageProfileId || item.id;
      if (!key || map.has(key)) return;
      const label = item.packageName || key;
      map.set(key, { label, value: key });
    });
    return Array.from(map.values());
  }, [data]);

  const statusOptions = useMemo(
    () => [
      { label: 'Đang hiệu lực', value: 'ACTIVE' },
      { label: 'Hết hiệu lực', value: 'INACTIVE' },
    ],
    []
  );

  const columns: ColumnsType<IPurchaseHistoryItem> = useMemo(
    () => [
      {
        title: 'Tên gói',
        dataIndex: 'packageName',
        key: 'packageName',
      },
      {
        title: 'Thời gian bắt đầu',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (value: string) => formatDate(value),
      },
      {
        title: 'Thời gian kết thúc',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (value: string) => formatDate(value),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (value: string) => renderStatus(value),
      },
    ],
    []
  );

  const actionComponent = useMemo(
    () => (
      <Link to={pathRoutes.buyPackageServiceAdd}>
        <CButton icon={<Plus size={20} />}>Mua gói</CButton>
      </Link>
    ),
    []
  );

  const filters: FilterItemProps[] = useMemo(
    () => [
      {
        type: 'Select',
        name: 'packageProfileId',
        label: 'Gói cước',
        placeholder: 'Chọn gói cước',
        options: packageFilterOptions,
      },
      {
        type: 'Select',
        name: 'status',
        label: 'Trạng thái',
        placeholder: 'Chọn trạng thái',
        options: statusOptions,
      },
    ],
    [packageFilterOptions, statusOptions]
  );

  return {
    purchaseHistory: data,
    loading: isLoading,
    columns,
    actionComponent,
    filters,
  };
};
