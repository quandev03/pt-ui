import { Typography } from 'antd';

import { Text } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { DateFormat } from '@react/constants/app';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { CTag } from '@react/commons/index';
import { getColorStatusApproval } from '../type';

export const getColumnsTableTopupAssignPackage = (
  params: {
    page: number;
    size: number;
  },
  handleDownloadFile: (uri: string) => void,
  PROCESS_STATUS_STATUS: AnyElement
): ColumnsType<AnyElement> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên file',
      dataIndex: 'fileName',
      width: 150,
      render(value, record) {
        return (
          <div className="cursor-pointer">
            <Tooltip title={value} placement="topLeft">
              <Text
                className="text-blue underline"
                onClick={() => handleDownloadFile(record.fileUrl)}
              >
                {value}
              </Text>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: 'User thực hiện',
      dataIndex: 'createdBy',
      width: 150,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'createdDate',
      width: 150,
      render(value) {
        const text = value ? dayjs(value).format(DateFormat.DATE_TIME) : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'status',
      width: 150,
      render(value) {
        const text = PROCESS_STATUS_STATUS.find(
          (item: AnyElement) => Number(item.value) === value
        )?.label;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag color={getColorStatusApproval(Number(value))}>{text}</CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Kết quả',
      width: 150,
      align: 'left',
      render: (_, record) => {
        const succeededNumber = record?.successNumber;
        const failedNumber = record?.failNumber;
        const checkStatuts = !!record?.status;
        return (
          record?.status === 3 && (
            <div>
              <div className="flex flex-col items-start">
                <Tooltip
                  placement="topLeft"
                  title={`Số lượng thành công: ${succeededNumber}`}
                >
                  <Text>Số lượng thành công: {succeededNumber}</Text>
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={`Số lượng thất bại: ${failedNumber ?? ''}`}
                >
                  <Text>Số lượng thất bại: {failedNumber}</Text>
                </Tooltip>
                <Text>
                  File kết quả:
                  {checkStatuts && (
                    <Typography.Text
                      style={{
                        color: 'green',
                        textDecoration: 'underline',
                        fontStyle: 'italic',
                        marginLeft: '4px',
                      }}
                      onClick={() => handleDownloadFile(record.resultFileUrl)}
                      className="text-red-600 underline cursor-pointer"
                    >
                      File
                    </Typography.Text>
                  )}
                </Text>
              </div>
            </div>
          )
        );
      },
    },
  ];
};
