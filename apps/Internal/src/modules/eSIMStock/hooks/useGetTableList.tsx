import {
  CButtonDetail,
  CTag,
  CTooltip,
  RenderCell,
  StatusEnum,
  TypeTagEnum,
  WrapperActionTable,
  decodeSearchParams,
  formatDate,
  usePermissions,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { ActiveStatusEnum, ActiveStatusLabel, IeSIMStockItem } from '../types';
import useConfigAppStore from '../../Layouts/stores';

export const useGetTableList = (
  handleOpenModal: (record: IeSIMStockItem) => void
): ColumnsType<IeSIMStockItem> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);

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
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 200,
      align: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Serial SIM',
      dataIndex: 'serial',
      width: 250,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Gói cước',
      dataIndex: 'packCode',
      width: 100,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
      width: 250,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Đại lý',
      dataIndex: 'orgName',
      width: 250,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },

    {
      title: 'Trạng thái thuê bao',
      dataIndex: 'status',
      width: 120,
      align: 'left',
      render(value, record) {
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
      title: 'Trạng thái chặn cắt',
      dataIndex: 'activeStatus',
      width: 160,
      align: 'left',
      render(value: ActiveStatusEnum) {
        const label = ActiveStatusLabel[value] || '';
        const isNotBlocked = value === ActiveStatusEnum.NOT_BLOCKED;

        return (
          <CTooltip title={label} placement="topLeft">
            <CTag type={isNotBlocked ? TypeTagEnum.SUCCESS : TypeTagEnum.ERROR}>
              {label}
            </CTag>
          </CTooltip>
        );
      },
    },

    {
      title: 'Người gen QR',
      dataIndex: 'genQrBy',
      width: 250,
      align: 'left',
      render(value) {
        return value ? <RenderCell value={value} /> : null;
      },
    },

    {
      title: 'Thời gian cập nhật',
      dataIndex: 'modifiedDate',
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
                  handleOpenModal(record);
                }}
              />
            )}
          </WrapperActionTable>
        );
      },
    },
  ];
};
