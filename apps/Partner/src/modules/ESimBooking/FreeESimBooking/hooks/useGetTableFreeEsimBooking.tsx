import { IFreeEsimBooking } from '../types';
import { ColumnsType } from 'antd/es/table';
import {
  decodeSearchParams,
  IModeAction,
  RenderCell,
  usePermissions,
  WrapperActionTable,
  CButtonDetail,
  formatDateTime,
} from '@vissoft-react/common';
import useConfigAppStore from '../../../Layouts/stores';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from '../../../../routers/url';
import dayjs from 'dayjs';

export const useGetTableFreeEsimBooking = (): ColumnsType<IFreeEsimBooking> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const navigate = useNavigate();

  const handleAction = (action: IModeAction, record: IFreeEsimBooking) => {
    switch (action) {
      case IModeAction.READ: {
        console.log('current action', action);
        const toView = pathRoutes.freeEsimBookingView;
        if (typeof toView === 'function') {
          console.log('id is: ', record.id);
          navigate(toView(record.id));
        }
        break;
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
          />
        );
      },
    },
    {
      title: 'Số lượng eSIM',
      dataIndex: 'quantity',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Gói cước',
      dataIndex: 'pckCode',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'User thực hiện',
      dataIndex: 'createdBy',
      width: 250,
      align: 'left',
      fixed: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdDate',
      width: 250,
      align: 'left',
      fixed: 'left',
      render(value) {
        const textFormatDate = value ? dayjs(value).format(formatDateTime) : '';
        return <RenderCell value={textFormatDate} tooltip={textFormatDate} />;
      },
    },
    {
      title: 'Thời gian hoàn thành',
      dataIndex: 'finishedDate',
      width: 250,
      align: 'left',
      fixed: 'left',
      render(value) {
        const textFormatDate = value ? dayjs(value).format(formatDateTime) : '';
        return <RenderCell value={textFormatDate} tooltip={textFormatDate} />;
      },
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value) {
        let displayText = '';
        let textColor = '';

        if (value === 2) {
          displayText = 'Hoàn thành';
          textColor = '#178801';
        } else {
          displayText = 'Đang xử lý';
          textColor = '#FAAD14';
        }

        return (
          <RenderCell
            value={<span style={{ color: textColor }}>{displayText}</span>}
            tooltip={displayText}
          />
        );
      },
    },
    {
      title: 'Kết quả',
      dataIndex: 'succeededNumber',
      width: 300,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={
              <div>
                <div>Số lượng thành công: {record.succeededNumber}</div>
                <div>Số lượng thất bại: {record.failedNumber}</div>
              </div>
            }
            tooltip={`Số lượng thành công: ${record.succeededNumber}\nSố lượng thất bại: ${record.failedNumber}`}
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
