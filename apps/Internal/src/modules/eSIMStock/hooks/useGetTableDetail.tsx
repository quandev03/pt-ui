import {
  RenderCell,
  decodeSearchParams,
  formatDateTimeHHmmRevert,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { IeSIMStockDetail } from '../types';
import useConfigAppStore from '../../Layouts/stores';

export const useGetTableDetail = (): ColumnsType<IeSIMStockDetail> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const {
    params: { ACTION_HISTORY_ACTION_CODE = [] },
  } = useConfigAppStore();
  return [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
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
      title: 'Loại tác động',
      dataIndex: 'actionCode',
      width: 200,
      align: 'left',
      render(value) {
        const renderValue =
          ACTION_HISTORY_ACTION_CODE.find((item) => item.code === value)
            ?.value || '';
        return <RenderCell value={renderValue} tooltip={renderValue} />;
      },
    },
    {
      title: 'Người tác động',
      dataIndex: 'createdBy',
      width: 250,
      align: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },

    {
      title: 'Thời gian',
      dataIndex: 'actionDate',
      width: 120,
      align: 'left',
      render(value) {
        const textformatDate = value
          ? dayjs(value).format(formatDateTimeHHmmRevert)
          : '';
        return <RenderCell value={textformatDate} />;
      },
    },
  ];
};
