import { CButtonDetail } from '@react/commons/Button';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import {
  AnyElement,
  IParamsRequest,
  ModelStatus,
  ParamsOption,
} from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { Dropdown, Form, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import { IItemPromotionProgram, PromCodeMethods } from '../types';
import Show from '@react/commons/Template/Show';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
export const getColumnsTablePromotionProgram = (
  params: IParamsRequest,
  {
    onDetail,
    onEdit,
    onDownload,
  }: {
    onDetail: (id: string) => void;
    onEdit: (id: string) => void;
    onDownload: (record: IItemPromotionProgram) => void;
  }
): ColumnsType<IItemPromotionProgram> => {
  const renderMenuItemsMore = (record: IItemPromotionProgram): AnyElement => {
    const arr = [
      {
        key: ActionsTypeEnum.UPDATE,
        label: <Text onClick={() => onEdit(String(record.id))}>Chỉnh sửa</Text>,
      },
    ];
    return arr;
  };

  const {
    PROMOTION_PROGRAM_PROGRAM_SERVICE = [],
    PROMOTION_PROGRAM_PROMOTION_TYPE = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  return [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên mã khuyến mại',
      dataIndex: 'promName',
      align: 'left',
      width: 200,
      render(value: string) {
        return (
          <Tooltip placement="topLeft" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Mã khuyến mại',
      dataIndex: 'promCode',
      align: 'left',
      width: 140,
      render(value: string, record) {
        return (
          <Tooltip placement="topLeft" title={value}>
            <Show.When
              isTrue={record.promCodeMethod === PromCodeMethods.ONE_CODE}
            >
              <Text>{value}</Text>
            </Show.When>
            <Show.When
              isTrue={record.promCodeMethod === PromCodeMethods.MANY_CODE}
            >
              <Text>
                <Typography.Text
                  style={{
                    color: '#005AAA',
                    textDecoration: 'underline',
                    fontStyle: 'italic',
                    marginLeft: '4px',
                  }}
                  onClick={() => onDownload(record)}
                  className="cursor-pointer"
                >
                  {record.promCode}
                </Typography.Text>
              </Text>
            </Show.When>
          </Tooltip>
        );
      },
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'programService',
      align: 'left',
      width: 140,
      render(value: string) {
        const text =
          PROMOTION_PROGRAM_PROGRAM_SERVICE.find((item) => item.value === value)
            ?.label ?? '';
        return (
          <Tooltip placement="topLeft" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Khuyến mại theo',
      dataIndex: 'promotionType',
      align: 'left',
      width: 140,
      render(value: string) {
        const text =
          PROMOTION_PROGRAM_PROMOTION_TYPE.find(
            (item) => Number(item.value) === Number(value)
          )?.label ?? '';
        return (
          <Tooltip placement="topLeft" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng mã',
      dataIndex: 'quantity',
      align: 'left',
      width: 100,
      render(value: string) {
        return (
          <Tooltip placement="topLeft" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      align: 'left',
      width: 140,
      render(value: string) {
        const text = value ? value : '';
        return (
          <Tooltip placement="topLeft" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      align: 'left',
      width: 140,
      render(value: string) {
        const text = value ? value : '';
        return (
          <Tooltip placement="topLeft" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      align: 'left',
      width: 140,
      render(value: string) {
        return (
          <Tooltip placement="topLeft" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      align: 'left',
      width: 100,
      render(value: string) {
        const text = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip
            placement="topLeft"
            title={dayjs(value).format(formatDateTime)}
          >
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      align: 'left',
      width: 140,
      render(value: string, record: AnyElement) {
        return (
          <Tooltip placement="topLeft" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      align: 'left',
      width: 120,
      render(value: string, record: AnyElement) {
        const text = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip
            placement="topLeft"
            title={dayjs(value).format(formatDateTime)}
          >
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 100,
      align: 'left',
      render: (value) => {
        return (
          <Tooltip
            title={
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
            }
            placement="topLeft"
          >
            <CTag
              color={
                value === ModelStatus.ACTIVE
                  ? ColorList.SUCCESS
                  : ColorList.DEFAULT
              }
            >
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
            </CTag>
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
            <CButtonDetail onClick={() => onDetail(String(record.id))} />
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
