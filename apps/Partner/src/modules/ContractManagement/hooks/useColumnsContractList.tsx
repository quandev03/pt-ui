import { ColumnsType } from 'antd/es/table';
import { IContract } from '../types';
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
import { Dropdown } from 'antd';
import { MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';

interface useColumnsContractListProps {
  onViewDetails: (record: IContract) => void;
}

export const useColumnsContractList = ({
  onViewDetails,
}: useColumnsContractListProps): ColumnsType<IContract> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);

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
      title: 'Tên',
      dataIndex: 'tenantName',
      width: 200,
      align: 'left',
      render(value, record) {
        // Ưu tiên tenantName, fallback về name (legacy)
        const displayName = value || record.name || '-';
        return <RenderCell value={displayName} tooltip={displayName} />;
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'tenantPermanentAddress',
      width: 250,
      align: 'left',
      render(value, record) {
        // Ưu tiên tenantPermanentAddress, fallback về address (legacy)
        const displayAddress = value || record.address || record.roomAddress || '-';
        return <RenderCell value={displayAddress} tooltip={displayAddress} />;
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'tenantPhone',
      width: 150,
      align: 'left',
      render(value, record) {
        // Ưu tiên tenantPhone, fallback về phone (legacy)
        const displayPhone = value || record.phone || '-';
        return <RenderCell value={displayPhone} tooltip={displayPhone} />;
      },
    },
    {
      title: 'Thời gian bắt đầu',
      width: 150,
      align: 'left',
      render(_, record) {
        // Tạo date từ startDateDay, startDateMonth, startYear
        if (record.startDateDay && record.startDateMonth && record.startYear) {
          const dateStr = `${record.startYear}-${record.startDateMonth}-${record.startDateDay}`;
          const date = dayjs(dateStr);
          if (date.isValid()) {
            return (
              <RenderCell
                value={date.format(formatDate)}
                tooltip={date.format(formatDateTime)}
              />
            );
          }
        }
        // Fallback về startDate (legacy)
        if (record.startDate) {
          return (
            <RenderCell
              value={dayjs(record.startDate).format(formatDate)}
              tooltip={dayjs(record.startDate).format(formatDateTime)}
            />
          );
        }
        return <RenderCell value="-" tooltip="-" />;
      },
    },
    {
      title: 'Thời gian kết thúc',
      width: 150,
      align: 'left',
      render(_, record) {
        // Tạo date từ endDateDay, endDateMonth, endYear
        if (record.endDateDay && record.endDateMonth && record.endYear) {
          const dateStr = `${record.endYear}-${record.endDateMonth}-${record.endDateDay}`;
          const date = dayjs(dateStr);
          if (date.isValid()) {
            return (
              <RenderCell
                value={date.format(formatDate)}
                tooltip={date.format(formatDateTime)}
              />
            );
          }
        }
        // Fallback về endDate (legacy)
        if (record.endDate) {
          return (
            <RenderCell
              value={dayjs(record.endDate).format(formatDate)}
              tooltip={dayjs(record.endDate).format(formatDateTime)}
            />
          );
        }
        return <RenderCell value="-" tooltip="-" />;
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

