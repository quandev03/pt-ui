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
  formatDate,
  formatDateTime,
  usePermissions,
} from '@vissoft-react/common';
import { Dropdown } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupportDeleteAgency } from '.';
import { StatusLabel } from '../../../../src/constants';
import { pathRoutes } from '../../../routers';
import useConfigAppStore from '../../Layouts/stores';
import { IAgency } from '../types';

export const useGetTableList = (): ColumnsType<IAgency> => {
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const navigate = useNavigate();
  const { mutate: deleteAgency } = useSupportDeleteAgency();
  const handleAction = (action: IModeAction, record: IAgency) => {
    switch (action) {
      case IModeAction.READ: {
        const to = pathRoutes.agencyView;
        if (typeof to === 'function') {
          navigate(to(record.id));
        }
        break;
      }
      case IModeAction.UPDATE: {
        const to = pathRoutes.agencyEdit;
        if (typeof to === 'function') {
          navigate(to(record.id));
        }
        break;
      }
      case IModeAction.DELETE:
        ModalConfirm({
          message: 'Bạn có chắc chắn muốn Xóa bản ghi không?',
          handleConfirm: () => {
            deleteAgency(record.id as string);
          },
        });
        break;
    }
  };
  return [
    {
      title: 'Tên đại lý',
      dataIndex: 'orgName',
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
      title: 'Mã đại lý',
      dataIndex: 'orgCode',
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
        const textformatDate = value
          ? dayjs(value, formatDateTime).format(formatDate)
          : '';
        const textformatDateTime = value
          ? dayjs(value, formatDateTime).format(formatDateTime)
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
      dataIndex: 'modifiedBy',
      width: 200,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} disabled={record?.status !== 1} />;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 120,
      align: 'left',
      render(value, record) {
        const textformatDate = value
          ? dayjs(value, formatDateTime).format(formatDate)
          : '';
        const textformatDateTime = value
          ? dayjs(value, formatDateTime).format(formatDateTime)
          : '';
        return (
          <RenderCell
            tooltip={textformatDateTime}
            value={textformatDate}
            disabled={record?.status !== 1}
          />
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
              {value === StatusEnum.ACTIVE
                ? StatusLabel.ACTIVE
                : StatusLabel.INACTIVE}
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
          ...(record.parentId !== null
            ? [
                {
                  key: IModeAction.UPDATE,
                  onClick: () => {
                    handleAction(IModeAction.UPDATE, record);
                  },
                  label: <Text>Sửa</Text>,
                },
              ]
            : []),
          ...(record.parentId !== null
            ? [
                {
                  key: IModeAction.DELETE,
                  onClick: () => {
                    handleAction(IModeAction.DELETE, record);
                  },
                  label: <Text type="danger">Xóa</Text>,
                },
              ]
            : []),
        ].filter((item) => permission.getAllPermissions().includes(item.key));

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
