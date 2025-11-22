import { ColumnsType } from 'antd/es/table';
import { IRoomService } from '../types';
import { useSearchParams } from 'react-router-dom';
import {
  decodeSearchParams,
  IModeAction,
  RenderCell,
  usePermissions,
  Text,
  WrapperActionTable,
  formatDate,
  CTooltip,
  formatDateTime,
  ModalConfirm,
} from '@vissoft-react/common';
import useConfigAppStore from '../../Layouts/stores';
import { Dropdown, Tag } from 'antd';
import { MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import { ServiceTypeMap } from '../constants/enum';
import { useMemo } from 'react';
import { useDeleteRoomService } from './index';
import { useGetAgencyOptions } from '../../../hooks/useGetAgencyOptions';

interface useColumnsRoomServiceListProps {
  onViewDetails: (record: IRoomService) => void;
  onEdit: (record: IRoomService) => void;
  onDelete: (record: IRoomService) => void;
}

export const useColumnsRoomServiceList = ({
  onViewDetails,
  onEdit,
  onDelete,
}: useColumnsRoomServiceListProps): ColumnsType<IRoomService> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { mutate: deleteRoomService } = useDeleteRoomService();
  const { data: agencyOptions = [] } = useGetAgencyOptions();

  const handleDelete = (record: IRoomService) => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn xóa dịch vụ này không?',
      handleConfirm: () => {
        deleteRoomService(record.id);
      },
    });
  };

  // Helper function to find room name from orgUnitId
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
      title: 'Tên phòng',
      dataIndex: 'orgUnitName',
      width: 200,
      align: 'left',
      render(value, record) {
        const roomName = value || findRoomName(record.orgUnitId);
        return <RenderCell value={roomName} tooltip={roomName} />;
      },
    },
    {
      title: 'Loại dịch vụ',
      dataIndex: 'serviceType',
      width: 150,
      align: 'left',
      render(value) {
        const label = ServiceTypeMap[value as keyof typeof ServiceTypeMap] || value;
        return <RenderCell value={label} tooltip={label} />;
      },
    },
    {
      title: 'Giá',
      dataIndex: 'price',
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
        const isActive = value === 1;
        return (
          <Tag color={isActive ? 'green' : 'red'} bordered={false}>
            {isActive ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 150,
      align: 'left',
      render(value) {
        return <RenderCell value={value || '-'} tooltip={value || '-'} />;
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
          {
            key: IModeAction.UPDATE,
            onClick: () => onEdit(record),
            label: <Text>Sửa</Text>,
          },
          {
            key: IModeAction.DELETE,
            onClick: () => handleDelete(record),
            label: <Text>Xóa</Text>,
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

