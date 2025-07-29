import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { AnyElement, IParamsRequest } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import {
  DeliveryOrderApprovalStatusList,
  DeliveryOrderStatusList,
} from '@react/constants/status';
import { formatCurrencyVND } from '@react/helpers/utils';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import dayjs from 'dayjs';
import {
  GetListOrgSubType,
  GetListStatusApproval,
  IItemAirtimeBonusTransactionPartner,
  mappingColor,
} from '../type';
import { CButtonDetail } from '@react/commons/Button';
export const getColumnsAirtimeBonusTransactionPartner = (
  params: IParamsRequest,
  handleApprovalProgress: (id: number) => void,
  handleDelete: (id: number) => void,
  handleDownloadFile: (payload: { id: number; fileName: string }) => void,
  onDetail: (record: any) => void
): ColumnsType<AnyElement> => {
  const renderMenuItemsMore = (
    record: IItemAirtimeBonusTransactionPartner
  ): AnyElement => {
    const arr = [];
    if (record.approvalStatus !== DeliveryOrderStatusList.CANCEL) {
      arr.push({
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => handleApprovalProgress(record.id)}>
            Tiến độ phê duyệt
          </Text>
        ),
      });
    }
    if (record.approvalStatus === DeliveryOrderApprovalStatusList.PENDING) {
      arr.push({
        key: ActionsTypeEnum.DELETE,
        label: (
          <Text
            className="w-full"
            type="danger"
            onClick={() => handleDelete(record.id)}
          >
            Hủy
          </Text>
        ),
      });
    }
    return arr;
  };
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(value, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên đối tác',
      align: 'left',
      width: 130,
      dataIndex: 'orgName',
      render(value: string) {
        return (
          <Tooltip placement="topLeft" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại đối tác',
      align: 'left',
      width: 130,
      dataIndex: 'orgSubType',
      render(value: string) {
        const text = GetListOrgSubType().find(
          (item) => item.value === value
        )?.label;
        return (
          <Tooltip placement="topLeft" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số tiền cộng',
      align: 'right',
      width: 130,
      dataIndex: 'amount',
      render(value: string) {
        const text = formatCurrencyVND(Number(value));
        return (
          <Tooltip placement="topRight" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      align: 'left',
      width: 130,
      dataIndex: 'approvalStatus',
      render(value: string) {
        const text = GetListStatusApproval().find(
          (item) => item.value === String(value)
        )?.label;
        return (
          <Tooltip placement="topLeft" title={text}>
            <CTag color={mappingColor[value as keyof typeof mappingColor]}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cộng tiền',
      align: 'left',
      width: 130,
      dataIndex: 'createdBy',
      render(value: string) {
        return (
          <Tooltip placement="topLeft" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian cộng tiền',
      align: 'left',
      width: 130,
      dataIndex: 'transDate',
      render(value: string) {
        const text = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip
            placement="topLeft"
            title={value ? dayjs(value).format(formatDateTime) : ''}
          >
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian tạo',
      align: 'left',
      width: 130,
      dataIndex: 'createdDate',
      render(value: string) {
        const text = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip
            placement="topLeft"
            title={value ? dayjs(value).format(formatDateTime) : ''}
          >
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'File đính kèm',
      align: 'left',
      dataIndex: 'attachments',
      width: 160,
      render(values: any) {
        return values.map((item: any) => {
          return (
            <Tooltip
              placement="topLeft"
              title={item.fileName}
              className="cursor-pointer"
            >
              <Text
                onClick={() =>
                  handleDownloadFile({
                    fileName: item.fileName,
                    id: item.id,
                  })
                }
                style={{ cursor: 'pointer', color: 'blue' }}
                className="mt-2"
              >{`> ${item.fileName}`}</Text>
            </Tooltip>
          );
        });
      },
    },
    {
      title: 'Ghi chú',
      align: 'left',
      width: 130,
      dataIndex: 'description',
      render(value: string) {
        return (
          <Tooltip placement="topLeft" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            <CButtonDetail onClick={() => onDetail(record)} />
            <Dropdown
              menu={{ items: renderMenuItemsMore(record) }}
              placement="bottom"
              trigger={['click']}
            >
              <IconMore className="iconMore" />
            </Dropdown>
          </WrapperActionTable>
        );
      },
    },
  ];
};
