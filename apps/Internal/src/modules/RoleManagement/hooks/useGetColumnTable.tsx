import { ColumnsType } from 'antd/es/table';
import { IRoleItem } from '../types';
import {
  CTag,
  IModeAction,
  RenderCell,
  TypeTagEnum,
  decodeSearchParams,
  formatDate,
  formatDateTime,
  usePermissions,
  Text,
  WrapperActionTable,
  CButtonDetail,
  ModalConfirm,
} from '@vissoft-react/common';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../Layouts/stores';
import dayjs from 'dayjs';
import { Dropdown, Tooltip } from 'antd';
import { pathRoutes } from '../../../routers/url';
import { MoreVertical } from 'lucide-react';

export const useGetColumnTable = (): ColumnsType<IRoleItem> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const navigate = useNavigate();
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <RenderCell value={index + 1 + params.page * params.size} />;
      },
    },
    {
      title: 'Mã vai trò',
      dataIndex: 'code',
      align: 'left',
      width: 100,
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      align: 'left',
      width: 100,
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      align: 'left',
      width: 200,
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      align: 'left',
      width: 100,
      render(value) {
        return (
          <RenderCell
            value={value ? dayjs(value).format(formatDate) : ''}
            tooltip={value ? dayjs(value).format(formatDateTime) : ''}
          />
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'lastModifiedBy',
      align: 'left',
      width: 200,
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'lastModifiedDate',
      align: 'left',
      width: 100,
      render(value) {
        return (
          <RenderCell
            value={value ? dayjs(value).format(formatDate) : ''}
            tooltip={value ? dayjs(value).format(formatDateTime) : ''}
          />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'left',
      width: 100,
      render(value) {
        return (
          <Tooltip
            title={value ? 'Hoạt động' : 'Ngưng hoạt động'}
            placement="topLeft"
          >
            <CTag type={value === 1 ? TypeTagEnum.SUCCESS : TypeTagEnum.ERROR}>
              {value ? 'Hoạt động' : 'Ngưng hoạt động'}
            </CTag>
          </Tooltip>
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
              navigate(pathRoutes.roleManagerEdit(record.id));
            },
            label: <Text>Sửa</Text>,
          },
          {
            key: IModeAction.DELETE,
            onClick: () => {
              ModalConfirm({
                title: 'Xóa vai trò',
                message: 'Bạn có chắc chắn muốn xóa vai trò này?',
                handleConfirm: () => {
                  console.log('ok');
                },
              });
            },
            label: <Text type="danger">Xóa</Text>,
          },
        ].filter((item) => permission.getAllPermissions().includes(item.key));
        return (
          <WrapperActionTable>
            {permission.canRead && (
              <CButtonDetail
                onClick={() => {
                  navigate(pathRoutes.roleManagerView(record.id));
                }}
              />
            )}
            <div className="w-5">
              {(permission.canUpdate || permission.canDelete) && (
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
};
