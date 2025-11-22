import { ColumnsType } from 'antd/es/table';
import { IRoomPayment } from '../types';
import { useSearchParams } from 'react-router-dom';
import {
  decodeSearchParams,
  IModeAction,
  RenderCell,
  usePermissions,
  Text,
  WrapperActionTable,
  formatDate,
  formatDateTime,
} from '@vissoft-react/common';
import useConfigAppStore from '../../Layouts/stores';
import { Dropdown, Tag } from 'antd';
import { MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import { PaymentStatusMap } from '../constants/enum';
import { PaymentStatus } from '../types';
import { useGetAgencyOptions } from '../../../hooks/useGetAgencyOptions';

interface useColumnsRoomPaymentListProps {
  onViewDetails: (record: IRoomPayment) => void;
}

export const useColumnsRoomPaymentList = ({
  onViewDetails,
}: useColumnsRoomPaymentListProps): ColumnsType<IRoomPayment> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: agencyOptions = [] } = useGetAgencyOptions();

  const findRoomName = (orgUnitId: string): string => {
    const findInTree = (nodes: any[]): string | null => {
      for (const node of nodes) {
        if (node.value === orgUnitId) {
          return node.title;
        }
        if (node.children) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(agencyOptions) || '-';
  };

  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        const page = params.page || 0;
        const size = params.size || 10;
        const stt = index + 1 + page * size;
        return (
          <RenderCell
            value={stt}
            tooltip={stt}
          />
        );
      },
    },
    {
      title: 'Mã phòng',
      dataIndex: 'orgUnitName',
      width: 150,
      align: 'left',
      render(value, record) {
        const roomName = value || findRoomName(record.orgUnitId);
        return <RenderCell value={roomName} tooltip={roomName} />;
      },
    },
    {
      title: 'Tháng/Năm',
      width: 120,
      align: 'center',
      render(_, record) {
        const monthYear = `${record.month}/${record.year}`;
        return <RenderCell value={monthYear} tooltip={monthYear} />;
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      width: 150,
      align: 'right',
      render(value) {
        const formattedPrice = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value || 0);
        return <RenderCell value={formattedPrice} tooltip={formattedPrice} />;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      align: 'center',
      render(value) {
        const isPaid = value === PaymentStatus.PAID;
        return (
          <Tag color={isPaid ? 'green' : 'orange'} bordered={false}>
            {PaymentStatusMap[value as PaymentStatus] || '-'}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 150,
      align: 'left',
      render(value) {
        if (!value) return <RenderCell value="-" tooltip="-" />;
        return (
          <RenderCell
            value={dayjs(value).format(formatDate)}
            tooltip={dayjs(value).format(formatDateTime)}
          />
        );
      },
    },
    {
      title: 'Hành động',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: IModeAction.READ,
            onClick: () => onViewDetails(record),
            label: <Text>Xem chi tiết</Text>,
          },
        ].filter((item) => permission.getAllPermissions().includes(item.key));

        return (
          <WrapperActionTable>
            <div className="w-5">
              <Dropdown
                menu={{ items: items }}
                placement="bottom"
                trigger={['click']}
              >
                <MoreVertical size={16} />
              </Dropdown>
            </div>
          </WrapperActionTable>
        );
      },
    },
  ];
};

