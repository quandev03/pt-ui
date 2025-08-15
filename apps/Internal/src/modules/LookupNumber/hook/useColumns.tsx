import { decodeSearchParams, RenderCell } from '@vissoft-react/common';
import { TableColumnsType } from 'antd';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IResLookupNumber } from '../types';

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
        title: 'Số',
        dataIndex: 'isdn',
        render: (value: string) => {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Đại lý',
        dataIndex: 'orgName',
        render: (value: string) => {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'statusText',
        key: 'statusText',
        render: (text: string) => {
          return <RenderCell value={text} />;
        },
      },
    ];
  }, [params.page, params.size]);
  return columns;
};
