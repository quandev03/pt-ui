import {
  CButtonDetail,
  IModeAction,
  RenderCell,
  WrapperActionTable,
  decodeSearchParams,
  formatDate,
  usePermissions,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IReportPartnerItem } from '../types';
import { pathRoutes } from '../../../routers';
import useConfigAppStore from '../../Layouts/stores';

export const useGetTableList = (): ColumnsType<IReportPartnerItem> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const navigate = useNavigate();

  const handleAction = (action: IModeAction, record: IReportPartnerItem) => {
    switch (action) {
      case IModeAction.READ: {
        const to = pathRoutes.reportPartnerView;
        if (typeof to === 'function') {
          navigate(to(record.id));
        }
        break;
      }
    }
  };

  return [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, __, index) {
        return (
          <RenderCell
            value={index + 1 + params.page * params.size}
            tooltip={index + 1 + params.page * params.size}
          />
        );
      },
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      width: 200,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Mã đối tác',
      dataIndex: 'partnerCode',
      width: 250,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Tên đối tác',
      dataIndex: 'partnerName',
      width: 100,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Loại dịch vụ',
      dataIndex: 'serviceType',
      width: 250,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Tổng tiền gói cước',
      dataIndex: 'agentName',
      width: 250,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Số lượng eSIM',
      dataIndex: 'esimCount',
      width: 250,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Người đặt hàng',
      dataIndex: 'orderedBy',
      width: 250,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },

    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderedAt',
      width: 120,
      align: 'left',
      render(value, record) {
        const textformatDate = value ? dayjs(value).format(formatDate) : '';

        return <RenderCell value={textformatDate} />;
      },
    },
    {
      title: 'Hành động',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            {permission.canRead && (
              <CButtonDetail
                onClick={() => {
                  handleAction(IModeAction.READ, record);
                }}
              />
            )}
          </WrapperActionTable>
        );
      },
    },
  ];
};
