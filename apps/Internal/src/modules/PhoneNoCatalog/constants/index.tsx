import { Text } from '@react/commons/Template/style';
import { IParamsRequest } from '@react/commons/types';
import { ColumnsType } from 'antd/es/table';
import { Tooltip } from 'antd/lib';
import { TableType } from '../type';

export const getColumnsTableSelectedUser = (
  params: IParamsRequest
): ColumnsType<TableType> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 26,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
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
      title: 'Tên user',
      dataIndex: 'fullname',
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
  ];
};
