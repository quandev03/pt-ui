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
        const toView = pathRoutes.buyBundleWithEsimView;
        if (typeof toView === 'function') {
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
      dataIndex: 'packageCodes',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Tổng tiền gói cước',
      dataIndex: 'amountTotal',
      width: 150,
      align: 'left',
      render(value, record) {
        // Kiểm tra nếu giá trị không hợp lệ (null, undefined) thì hiển thị gạch ngang
        if (value === null || value === undefined) {
          return <RenderCell value="-" tooltip="-" />;
        }
        const formattedValue = `${Number(value).toLocaleString('vi-VN')} đ`;

        return <RenderCell value={formattedValue} tooltip={formattedValue} />;
      },
    },
    {
      title: 'User thực hiện',
      dataIndex: 'createdBy',
      width: 300,
      align: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdDate',
      width: 200,
      align: 'left',
      render(value) {
        const textFormatDate = value ? dayjs(value).format(formatDateTime) : '';
        return <RenderCell value={textFormatDate} tooltip={textFormatDate} />;
      },
    },
    {
      title: 'Thời gian hoàn thành',
      dataIndex: 'orderDate',
      width: 200,
      align: 'left',
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
      width: 230,
      align: 'left',
      render(value, record) {
        const cellContent = (
          <div>
            <div>Số lượng thành công: {record.successedNumber}</div>
            <div>Số lượng thất bại: {record.failedNumber}</div>
          </div>
        );

        const tooltipContent = (
          <span>
            {`Số lượng thành công: ${record.successedNumber}`}
            <br />
            {`Số lượng thất bại: ${record.failedNumber}`}
          </span>
        );

        return <RenderCell value={cellContent} tooltip={tooltipContent} />;
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
