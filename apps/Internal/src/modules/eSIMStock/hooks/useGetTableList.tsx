import {
  CButtonDetail,
  CTooltip,
  RenderCell,
  WrapperActionTable,
  decodeSearchParams,
  formatDate,
  formatDateTime,
  usePermissions,
} from '@vissoft-react/common';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../Layouts/stores';
import {
  ActiveStatusColor,
  ActiveStatusEnum,
  ActiveStatusOptions,
  IeSIMStockItem,
  SubscriberStatusColor,
  SubscriberStatusOptions,
} from '../types';

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
      width: 120,
      align: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Serial SIM',
      dataIndex: 'serial',
      width: 180,
      align: 'left',
      render(value) {
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
      title: 'Đối tác',
      dataIndex: 'orgName',
      width: 230,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },

    {
      title: 'Trạng thái thuê bao',
      dataIndex: 'statusSub',
      width: 150,
      align: 'left',
      render(value) {
        const renderedValue =
          SubscriberStatusOptions.find((item) => item.value === value)?.label ||
          '';
        return (
          <CTooltip title={renderedValue} placement="topLeft">
            <Tag
              color={
                SubscriberStatusColor[
                  value as keyof typeof SubscriberStatusColor
                ]
              }
              bordered={false}
            >
              {renderedValue}
            </Tag>
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
        const renderedValue =
          ActiveStatusOptions.find((item) => item.value === value)?.label || '';

        return (
          <CTooltip title={renderedValue} placement="topLeft">
            <Tag
              color={ActiveStatusColor[value as keyof typeof ActiveStatusColor]}
              bordered={false}
            >
              {renderedValue}
            </Tag>
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
      width: 160,
      align: 'left',
      render(value) {
        const textformatDate = value ? dayjs(value).format(formatDate) : '';
        const textformatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';

        return (
          <RenderCell value={textformatDate} tooltip={textformatDateTime} />
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
