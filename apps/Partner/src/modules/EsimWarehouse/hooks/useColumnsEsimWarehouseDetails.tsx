import { ColumnsType } from 'antd/es/table';
import { IEsimWarehouseDetails } from '../types';
import { RenderCell } from '@vissoft-react/common';

export const useColumnsEsimWarehouseDetails =
  (): ColumnsType<IEsimWarehouseDetails> => {
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
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Người tác động',
        dataIndex: 'createdBy',
        width: 250,
        align: 'left',
        fixed: 'left',
        render(value) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Thời gian',
        dataIndex: 'actionDate',
        width: 150,
        align: 'left',
        fixed: 'left',
        render(value) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
    ];
  };
