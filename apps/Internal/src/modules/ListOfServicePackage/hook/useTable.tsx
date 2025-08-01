import {
  CButtonDetail,
  CSwitch,
  CTag,
  decodeSearchParams,
  formatCurrencyVND,
  IModeAction,
  RenderCell,
  Text,
  usePermissions,
  WrapperActionTable,
} from '@vissoft-react/common';
import { Dropdown, TableColumnsType, Tooltip } from 'antd';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../Layouts/stores';
import { AnyARecord } from 'dns';
import { IListOfServicePackage } from '../types';
import { MoreVertical } from 'lucide-react';

export const useTable = ({
  handleView,
  handleEdit,
  handleDelete,
}: {
  handleView: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}) => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const columns: TableColumnsType<IListOfServicePackage> = useMemo(() => {
    return [
      {
        title: 'STT',
        align: 'left',
        width: 50,
        fixed: 'left',
        render(_, record, index) {
          return (
            <RenderCell
              value={index + 1 + params.page * params.size}
              tooltip={index + 1 + params.page * params.size}
              disabled={!record?.status}
            />
          );
        },
      },
      {
        title: 'Mã gói cước',
        dataIndex: 'pckCode',
        width: 150,
        render: (value: string) => {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Tên gói cước',
        dataIndex: 'pckName',
        width: 150,
        render: (value: string) => {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Giá',
        dataIndex: 'packagePrice',
        width: 150,
        align: 'right',
        render: (value: string) => {
          return (
            <RenderCell
              value={formatCurrencyVND(value)}
              tooltip={formatCurrencyVND(value)}
            />
          );
        },
      },
      {
        title: 'Người tạo',
        dataIndex: 'createdBy',
        width: 150,
        render: (value: string) => {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: 150,
        render: (value: string) => {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Người cập nhật',
        dataIndex: 'modifiedBy',
        width: 150,
        render: (value: string) => {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 180,
        align: 'left',
        render(value) {
          return <RenderCell value={value ? 'Hoạt động' : 'Không hoạt động'} />;
        },
      },
      {
        title: 'Thao tác',
        align: 'center',
        width: 150,
        fixed: 'right',
        render(_, record) {
          const items = [
            {
              key: IModeAction.UPDATE,
              onClick: () => {
                handleEdit(record.id);
              },
              label: <Text>Sửa</Text>,
            },
            {
              key: IModeAction.DELETE,
              onClick: () => {
                handleDelete(record.id);
              },
              label: <Text type="danger">Xóa</Text>,
            },
          ];

          return (
            <WrapperActionTable>
              {permission.canRead && (
                <CButtonDetail
                  onClick={() => {
                    handleView(record.id);
                  }}
                />
              )}
              <div className="w-5">
                {permission.canUpdate ||
                  (permission.canDelete && (
                    <Dropdown
                      menu={{ items: items }}
                      placement="bottom"
                      trigger={['click']}
                    >
                      <MoreVertical size={16} />
                    </Dropdown>
                  ))}
              </div>
            </WrapperActionTable>
          );
        },
      },
    ];
  }, [permission, params]);
  return { columns };
};
