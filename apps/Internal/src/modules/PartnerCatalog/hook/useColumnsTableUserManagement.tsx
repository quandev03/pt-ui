import {
  CButtonDetail,
  formatDate,
  formatDateTime,
  Text,
  RenderCell,
  WrapperActionTable,
  decodeSearchParams,
  CTag,
  StatusEnum,
  TypeTagEnum,
  IModeAction,
  usePermissions,
  AnyElement,
} from '@vissoft-react/common';
import { Dropdown } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { MoreVertical } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import useConfigAppStore from '../../Layouts/stores';
import { IRoleItem, IUserPartnerCatalog } from '../types';

export const useColumnsTableUserManagement = ({
  onAction,
}: {
  onAction: (type: IModeAction, record: IUserPartnerCatalog) => void;
}): ColumnsType<IUserPartnerCatalog> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { menuData } = useConfigAppStore();
  const permissions = usePermissions(menuData);
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên user',
      dataIndex: 'fullname',
      width: 150,
      align: 'left',
      render: (text) => <RenderCell value={text} tooltip={text} />,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 150,
      align: 'left',
      render: (text) => <RenderCell value={text} tooltip={text} />,
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      width: 150,
      align: 'left',
      render: (roles: IRoleItem[]) => {
        const renderedValue = roles.map((role) => role.name).join(', ');
        return <RenderCell value={renderedValue} tooltip={renderedValue} />;
      },
    },

    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      align: 'left',
      width: 120,
      render: (text) => <RenderCell value={text} tooltip={text} />,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      align: 'left',
      width: 120,
      render: (text) => (
        <RenderCell
          value={dayjs(text).format(formatDate)}
          tooltip={text ? dayjs(text).format(formatDateTime) : ''}
        />
      ),
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'lastModifiedBy',
      align: 'left',
      width: 120,
      render: (text) => <RenderCell value={text} tooltip={text} />,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'lastModifiedDate',
      align: 'left',
      width: 120,
      render: (text) => (
        <RenderCell
          value={dayjs(text).format(formatDate)}
          tooltip={text ? dayjs(text).format(formatDateTime) : ''}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'left',
      width: 120,
      render: (value) => {
        return (
          <CTag
            type={
              value === StatusEnum.ACTIVE
                ? TypeTagEnum.SUCCESS
                : TypeTagEnum.ERROR
            }
          >
            {value === StatusEnum.ACTIVE ? 'Hoạt động' : 'Không hoạt động'}
          </CTag>
        );
      },
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render(_, record) {
        const menuActionItems = [
          {
            key: IModeAction.UPDATE,
            label: 'Sửa',
            disabled: !permissions.canUpdate,
            onClick: () => onAction(IModeAction.UPDATE, record),
          },
        ];

        return (
          <div className="flex items-center justify-center gap-2">
            <CButtonDetail onClick={() => onAction(IModeAction.READ, record)} />
            <Dropdown
              menu={{
                items: menuActionItems,
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <WrapperActionTable>
                <MoreVertical size={16} />
              </WrapperActionTable>
            </Dropdown>
          </div>
        );
      },
    },
  ];
};
