import {
  CButtonDetail,
  CTag,
  CTooltip,
  decodeSearchParams,
  formatCurrencyVND,
  formatDate,
  formatDateTime,
  IModeAction,
  RenderCell,
  StatusEnum,
  Text,
  TypeTagEnum,
  usePermissions,
  WrapperActionTable,
} from '@vissoft-react/common';
import dayjs from 'dayjs';

import { Dropdown, TableColumnsType } from 'antd';
import { MoreVertical } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../Layouts/stores';
import { IListOfServicePackage } from '../types';

export const useTable = ({
  handleView,
  handleEdit,
}: {
  handleView: (id: string) => void;
  handleEdit: (id: string) => void;
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
              disabled={record?.status !== StatusEnum.ACTIVE}
            />
          );
        },
      },
      {
        title: 'Mã gói cước',
        dataIndex: 'pckCode',
        width: 150,
        render: (value: string, record: IListOfServicePackage) => {
          return (
            <RenderCell
              disabled={record?.status !== StatusEnum.ACTIVE}
              value={value}
              tooltip={value}
            />
          );
        },
      },
      {
        title: 'Tên gói cước',
        dataIndex: 'pckName',
        width: 150,
        render: (value: string, record: IListOfServicePackage) => {
          return (
            <RenderCell
              disabled={record?.status !== StatusEnum.ACTIVE}
              value={value}
              tooltip={value}
            />
          );
        },
      },
      {
        title: 'Giá',
        dataIndex: 'packagePrice',
        width: 150,
        align: 'right',
        render: (value: string, record: IListOfServicePackage) => {
          return (
            <RenderCell
              value={formatCurrencyVND(value)}
              tooltip={formatCurrencyVND(value)}
              disabled={record?.status !== StatusEnum.ACTIVE}
            />
          );
        },
      },
      {
        title: 'Người tạo',
        dataIndex: 'createdBy',
        width: 150,
        render: (value: string, record: IListOfServicePackage) => {
          return (
            <RenderCell
              disabled={record?.status !== StatusEnum.ACTIVE}
              value={value}
              tooltip={value}
            />
          );
        },
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: 150,
        render: (value: string, record: IListOfServicePackage) => {
          const text = value ? dayjs(value).format(formatDate) : '';
          return (
            <RenderCell
              disabled={record?.status !== StatusEnum.ACTIVE}
              value={text}
              tooltip={value ? dayjs(value).format(formatDateTime) : ''}
            />
          );
        },
      },
      {
        title: 'Người cập nhật',
        dataIndex: 'modifiedBy',
        width: 150,
        render: (value: string, record: IListOfServicePackage) => {
          return (
            <RenderCell
              disabled={record?.status !== StatusEnum.ACTIVE}
              value={value}
              tooltip={value}
            />
          );
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 180,
        align: 'left',
        render(value) {
          return (
            <CTooltip
              title={
                value === StatusEnum.ACTIVE ? 'Hoạt động' : 'Không hoạt động'
              }
              placement="topLeft"
            >
              <CTag
                type={
                  value === StatusEnum.ACTIVE
                    ? TypeTagEnum.SUCCESS
                    : TypeTagEnum.ERROR
                }
              >
                {value === StatusEnum.ACTIVE ? 'Hoạt động' : 'Không hoạt động'}
              </CTag>
            </CTooltip>
          );
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
          ].filter((item) => permission.getAllPermissions().includes(item.key));

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
                {permission.canUpdate && (
                  <Dropdown
                    menu={{ items: items }}
                    placement="bottom"
                    trigger={['click']}
                  >
                    <MoreVertical size={16} />
                  </Dropdown>
                )}
              </div>
            </WrapperActionTable>
          );
        },
      },
    ];
  }, [permission, params]);
  return { columns };
};
