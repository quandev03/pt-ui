import { IFreeEsimBooking } from '../types';
import { ColumnsType } from 'antd/es/table';
import {
  decodeSearchParams,
  IModeAction,
  RenderCell,
  usePermissions,
  Text,
  WrapperActionTable,
  CButtonDetail,
} from '@vissoft-react/common';
import useConfigAppStore from '../../../Layouts/stores';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from '../../../../routers/url';
import { Dropdown } from 'antd';
import { MoreVertical } from 'lucide-react';

export const useTableFreeEsimBooking = (): ColumnsType<IFreeEsimBooking> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const navigate = useNavigate();

  const handleAction = (action: IModeAction, record: IFreeEsimBooking) => {
    switch (action) {
      case IModeAction.READ: {
        const toView = pathRoutes.freeEsimBookingView;
        if (typeof toView === 'function') {
          navigate(toView(record.id));
        }
      }
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
            // disabled={!record?.status}
          />
        );
      },
    },
    {
      title: 'Số lượng eSIM',
      dataIndex: 'eSimTotalNumber',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            // disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Gói cước',
      dataIndex: 'package',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            // disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'User thực hiện',
      dataIndex: 'user',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            // disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdTime',
      width: 250,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            // disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Thời gian hoàn thành',
      dataIndex: 'duration',
      width: 250,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            // disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'processStatus',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            // disabled={record?.status !== 1}
          />
        );
      },
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      width: 300,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={value}
            tooltip={value}
            // disabled={record?.status !== 1}
          />
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
