import { useMemo } from 'react';
import { IResLookupNumber } from '../types';
import { ColumnProps } from 'antd/es/table';
import { TableColumnsType, Tag } from 'antd';
import {
  decodeSearchParams,
  RenderCell,
  StatusEnum,
} from '@vissoft-react/common';
import { useSearchParams } from 'react-router-dom';

export const useColumns = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const columns: TableColumnsType<IResLookupNumber> = useMemo(() => {
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
              disabled={record?.status !== StatusEnum.ACTIVE}
            />
          );
        },
      },
      {
        title: 'Số',
        dataIndex: 'isdn',
        render: (value: string, record: IResLookupNumber) => {
          return (
            <RenderCell
              disabled={record?.status !== StatusEnum.ACTIVE}
              value={value}
              tooltip={value}
            />
          );
        },
      },
      {
        title: 'Đại lý',
        dataIndex: 'orgName',
        render: (value: string, record: IResLookupNumber) => {
          return (
            <RenderCell
              disabled={record?.status !== StatusEnum.ACTIVE}
              value={value}
              tooltip={value}
            />
          );
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'statusText',
        key: 'statusText',
        render: (text) => {
          return <RenderCell value={text} />;
        },
      },
    ];
  }, [params.page, params.size]);
  return columns;
};
