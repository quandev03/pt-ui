import { CButtonDetail } from '@react/commons/Button';
import { Text } from '@react/commons/Template/style';
import { formatDateTime } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { IAuditItem } from './useGetAuditLog';
import { APP_CODE } from 'apps/Internal/src/constants';

export const useColumnsAuditLog = (
  onView: (record: IAuditItem) => void
): ColumnsType<IAuditItem> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return (
          <Text disabled={!record?.status}>
            {index + 1 + params.page * params.size}
          </Text>
        );
      },
    },
    {
      title: 'Người tác động',
      dataIndex: 'fullname',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Mã đối tác',
      dataIndex: 'clientCode',
      width: 100,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        const isShowText = record?.siteCode !== APP_CODE;
        if (isShowText) {
          return (
            <Tooltip title={value} placement="topLeft">
              <Text disabled={record?.status !== 1}>{value}</Text>
            </Tooltip>
          );
        }
        return null;
      },
    },
    {
      title: 'Tên đối tác',
      dataIndex: 'clientName',
      width: 100,
      align: 'left',
      render(value, record) {
        const isShowText = record?.siteCode !== APP_CODE;
        if (isShowText) {
          return (
            <Tooltip title={value} placement="topLeft">
              <Text disabled={record?.status !== 1}>{value}</Text>
            </Tooltip>
          );
        }
        return null;
      },
    },
    {
      title: 'Loại tác động',
      dataIndex: 'actionName',
      width: 100,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tác động',
      dataIndex: 'actionTime',
      width: 130,
      align: 'left',
      render(value, record) {
        const textFormatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <Tooltip title={textFormatDateTime} placement="topLeft">
            <Text disabled={record?.status !== 1}>{textFormatDateTime}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Nơi tác động',
      dataIndex: 'siteName',
      width: 130,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Chức năng',
      dataIndex: 'targetName',
      width: 130,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: 130,
      align: 'left',
      render(value, record) {
        return (
          <CButtonDetail
            onClick={() => {
              onView(record);
            }}
          />
        );
      },
    },
  ];
};
