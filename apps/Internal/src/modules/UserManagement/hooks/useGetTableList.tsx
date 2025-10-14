import {
  CButtonDetail,
  CTag,
  CTooltip,
  IModeAction,
  MESSAGE,
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
import { IGroups, IRoleItem } from '../../../types';
import useConfigAppStore from '../../Layouts/stores';
import { IUserItem } from '../types';
import { useSupportDeleteUser } from '.';
import { includes } from 'lodash';

export const useGetTableList = (): ColumnsType<IUserItem> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const navigate = useNavigate();
  const { mutate: deleteUser } = useSupportDeleteUser();
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
      case IModeAction.DELETE: {
        ModalConfirm({
          message: MESSAGE.G05,
          handleConfirm: () => {
            deleteUser(record.id);
          },
        });
        break;
      }
    }
  };
  return [
    {
      title: 'STT',
      align: 'left',
      width: 200,
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
      title: 'Mã khách hàng',
      //dataIndex: 'fullname',
      width: 200,
      align: 'left',
      // render(value, record) {
      //   return (
      //     <RenderCell
      //       value={value}
      //       tooltip={value}
      //       disabled={record?.status !== StatusEnum.ACTIVE}
      //     />
      //   );
      // },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            disabled={record?.status !== StatusEnum.ACTIVE}
          />
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
      align: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            disabled={record?.status !== StatusEnum.ACTIVE}
          />
        );
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            disabled={record?.status !== StatusEnum.ACTIVE}
          />
        );
      },
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      width: 200,
      align: 'left',
      render(value: IRoleItem[], record) {
        const roleNames = value
          ?.filter((item) => item.status !== StatusEnum.INACTIVE)
          ?.map((item) => item.name)
          ?.join(', ');
        return (
          // <RenderCell
          //   value={roleNames}
          //   tooltip={roleNames}
          //   disabled={record?.status !== StatusEnum.ACTIVE}
          // />
          "Chủ trọ"
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
        ].filter((item) => {
          return includes([IModeAction.UPDATE, IModeAction.DELETE], item.key);
        });

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