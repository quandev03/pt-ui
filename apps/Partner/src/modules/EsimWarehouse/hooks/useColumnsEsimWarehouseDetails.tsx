import { formatDate, RenderCell } from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useGetParamsOption } from '../../../hooks/useGetParamsOption';
import { IEsimWarehouseDetails } from '../types';

export const useColumnsEsimWarehouseDetails =
  (): ColumnsType<IEsimWarehouseDetails> => {
    const { data: getParams } = useGetParamsOption();

    const translateActionType = useMemo(() => {
      if (!getParams?.ACTION_HISTORY_ACTION_CODE) {
        return [];
      }
      return getParams.ACTION_HISTORY_ACTION_CODE.map((item) => ({
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
          return <RenderCell value={index + 1} tooltip={index + 1} />;
        },
      },
      {
        title: 'Loại tác động',
        dataIndex: 'actionCode',
        width: 200,
        align: 'left',
        fixed: 'left',
        render(value) {
          const action = translateActionType.find(
            (item) => item.code === value
          );
          const displayLabel = action ? action?.label : value;
          return <RenderCell value={displayLabel} tooltip={displayLabel} />;
        },
      },
      {
        title: 'Người tác động',
        dataIndex: 'createdBy',
        width: 250,
        align: 'left',
        fixed: 'left',
        render(value) {
          const displayValue = value === null ? 'KH' : value;
          return <RenderCell value={displayValue} tooltip={displayValue} />;
        },
      },
      {
        title: 'Thời gian',
        dataIndex: 'actionDate',
        width: 150,
        align: 'left',
        fixed: 'left',
        render(value) {
          return (
            <RenderCell
              value={dayjs(value).format(formatDate)}
              tooltip={value}
            />
          );
        },
      },
    ];
  };
