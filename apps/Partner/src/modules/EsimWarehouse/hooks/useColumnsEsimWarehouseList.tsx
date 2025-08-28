import { ColumnsType } from 'antd/es/table';
import { IEsimWarehouseList } from '../types';
import { useSearchParams } from 'react-router-dom';
import {
  decodeSearchParams,
  IModeAction,
  RenderCell,
  usePermissions,
  Text,
  WrapperActionTable,
  CButton,
  formatDate,
  CTooltip,
  formatDateTime,
} from '@vissoft-react/common';
import useConfigAppStore from '../../Layouts/stores';
import { Dropdown, Tag } from 'antd';
import { MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import { ActiveStatusMap, SubStatusMap } from '../constants/enum';
import { useMemo } from 'react';
import { useGetParamsOption } from '../../../hooks/useGetParamsOption';

interface useColumnsEsimWarehouseListProps {
  onGenQr: (record: IEsimWarehouseList) => void;
  onSendQr: (record: IEsimWarehouseList) => void;
  onViewDetails: (record: IEsimWarehouseList) => void;
}

export const useColumnsEsimWarehouseList = ({
  onGenQr,
  onSendQr,
  onViewDetails,
}: useColumnsEsimWarehouseListProps): ColumnsType<IEsimWarehouseList> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: getParams } = useGetParamsOption();

  const subStatusOptions = useMemo(() => {
    if (!getParams?.SUBSCRIBER_SUB_STATUS) {
      return [];
    }
    return getParams.SUBSCRIBER_SUB_STATUS.map((item) => ({
      code: item.code,
      label: item.value,
    }));
  }, [getParams]);

  const activeStatusOptions = useMemo(() => {
    if (!getParams?.SUBSCRIBER_ACTIVE_SUB_STATUS) {
      return [];
    }
    return getParams.SUBSCRIBER_ACTIVE_SUB_STATUS.map((item) => ({
      code: item.code,
      label: item.value,
    }));
  }, [getParams]);

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
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Serial SIM',
      dataIndex: 'serial',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Gói cước',
      dataIndex: 'packCode',
      width: 150,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
      width: 200,
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Đại lý',
      dataIndex: 'orgName',
      width: 150,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Trạng thái thuê bao',
      dataIndex: 'statusSub',
      width: 200,
      align: 'left',
      render(value) {
        const renderedValue =
          subStatusOptions.find((item) => item.code == value)?.label || '';
        return (
          <CTooltip title={renderedValue} placement="topLeft">
            <Tag
              color={SubStatusMap[value as keyof typeof SubStatusMap]}
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
      width: 200,
      align: 'left',
      render(value) {
        const renderedValue =
          activeStatusOptions.find((item) => item.code == value)?.label || '';

        return (
          <CTooltip title={renderedValue} placement="topLeft">
            <Tag
              color={ActiveStatusMap[value as keyof typeof ActiveStatusMap]}
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
      width: 200,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'modifiedDate',
      width: 150,
      align: 'left',
      render(value, record) {
        return (
          <RenderCell
            value={dayjs(value).format(formatDate)}
            tooltip={dayjs(value).format(formatDateTime)}
          />
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
            onClick: () => onSendQr(record),
            label: <Text>Gửi lại QR</Text>,
          },
          {
            key: IModeAction.READ,
            onClick: () => onViewDetails(record),
            label: <Text>Xem chi tiết</Text>,
          },
        ].filter((item) => permission.getAllPermissions().includes(item.key));

        return (
          <WrapperActionTable>
            <CButton type="default" onClick={() => onGenQr(record)}>
              Gen QR
            </CButton>
            <div className="w-5">
              <Dropdown
                menu={{ items: items }}
                placement="bottom"
                trigger={['click']}
              >
                <MoreVertical size={16} />
              </Dropdown>
            </div>
          </WrapperActionTable>
        );
      },
    },
  ];
};
