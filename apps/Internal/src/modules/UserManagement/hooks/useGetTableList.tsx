import {
  CButtonDetail,
  CTag,
  CTooltip,
  IModeAction,
  ModalConfirm,
  RenderCell,
  StatusEnum,
  Text,
  TypeTagEnum,
  WrapperActionTable,
  decodeSearchParams,
  formatDate,
  formatDateTime,
  usePermissions,
} from '@vissoft-react/common';
import { Dropdown } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MoreVertical } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from '../../../routers';
import { IRoleItem } from '../../../types';
import useConfigAppStore from '../../Layouts/stores';
import { IGroups, IUserItem } from '../types';
import { useCheckAllowDelete } from '.';

export const useGetTableList = (): ColumnsType<IUserItem> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const navigate = useNavigate();
  const { mutate: checkAllowDelete } = useCheckAllowDelete((id) => {
    deleteUser(id);
  });

  const handleAction = (action: IModeAction, record: IUserItem) => {
    switch (action) {
      case IModeAction.READ: {
        const to = pathRoutes.systemUserManagerView;
        if (typeof to === 'function') {
          navigate(to(record.id));
        }
        break;
      }
      case IModeAction.UPDATE: {
        const to = pathRoutes.systemUserManagerEdit;
        if (typeof to === 'function') {
          navigate(to(record.id));
        }
        break;
      }
      case IModeAction.DELETE:
        ModalConfirm({
          title: 'Bạn có chắc chắn muốn Xóa bản ghi không?',
          message: 'Các dữ liệu liên quan cũng sẽ bị xóa',
          handleConfirm: () => {
            checkAllowDelete(record.id);
          },
        });
        break;
    }
  };
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
      title: 'Họ và tên',
      dataIndex: 'fullname',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      width: 100,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} disabled={record?.status !== 1} />;
      },
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      width: 250,
      align: 'left',
      render(value: IRoleItem[], record) {
        const roleNames = value
          ?.filter((item) => item.status !== StatusEnum.INACTIVE)
          ?.map((item) => item.name)
          ?.join(', ');
        return (
          <RenderCell
            value={roleNames}
            tooltip={roleNames}
            disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Nhóm tài khoản',
      dataIndex: 'groups',
      width: 250,
      align: 'left',
      render(value: IGroups[], record) {
        const roleNames = value
          ?.filter((item) => item.status !== StatusEnum.INACTIVE)
          ?.map((item) => item.name)
          ?.join(', ');
        return (
          <RenderCell
            value={roleNames}
            tooltip={roleNames}
            disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 120,
      align: 'left',
      render(value, record) {
        const textformatDate = value ? dayjs(value).format(formatDate) : '';
        const textformatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <RenderCell
            value={textformatDate}
            tooltip={textformatDateTime}
            disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'lastModifiedBy',
      width: 200,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} disabled={record?.status !== 1} />;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'lastModifiedDate',
      width: 120,
      align: 'left',
      render(value, record) {
        const textformatDate = value ? dayjs(value).format(formatDate) : '';
        const textformatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <RenderCell value={textformatDate} disabled={record?.status !== 1} />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      render: (value) => {
        return (
          <CTooltip title={value} placement="topLeft">
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
      title: 'Hành động',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: IModeAction.UPDATE,
            onClick: () => {
              handleAction(IModeAction.UPDATE, record);
            },
            label: <Text>Sửa</Text>,
          },
          {
            key: IModeAction.DELETE,
            onClick: () => {
              handleAction(IModeAction.DELETE, record);
            },
            label: <Text type="danger">Xóa</Text>,
          },
        ];

        return (
          <WrapperActionTable>
            {permission.canRead && (
              <CButtonDetail
                onClick={() => {
                  handleAction(IModeAction.READ, record);
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
};
