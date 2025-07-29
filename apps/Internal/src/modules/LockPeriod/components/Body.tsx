import {
  CModalConfirm,
  CTable,
  NotificationSuccess,
} from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getColumnsTableLockPeriod } from '../constants';
import { useEdit } from '../hook/useEdit';
import { useList } from '../hook/useList';
import { ILockPeriod, STATUS_LOCKPERIOD } from '../type';
import { MESSAGE } from '@react/utils/message';

export const Body = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data, isPending } = useList({ page: params.page, size: params.size });
  const dataTable = useMemo(() => {
    if (!data) return [];
    return data.content;
  }, [data]);
  const [record, setRecord] = useState<ILockPeriod>();
  const { mutate: edit } = useEdit(() => {
    if (record && record.statusLock === STATUS_LOCKPERIOD.OPEN) {
      NotificationSuccess('Khóa kỳ thành công');
    } else {
      NotificationSuccess('Mở khóa kỳ thành công');
    }
  });
  const handleEdit = useCallback(
    (record: ILockPeriod) => {
      CModalConfirm({
        message:
          record.statusLock === STATUS_LOCKPERIOD.OPEN
            ? 'Bạn có chắc chắn muốn Khóa kỳ này không?'
            : 'Bạn có chắc chắn muốn Mở khóa kỳ này không?',
        onOk: () =>
          record &&
          edit({
            endDate: record.endDate,
            status:
              record.statusLock === STATUS_LOCKPERIOD.OPEN
                ? STATUS_LOCKPERIOD.CLOSE
                : STATUS_LOCKPERIOD.OPEN,
          }),
      });
      setRecord(record);
    },
    [edit]
  );
  return (
    <div>
      <TitleHeader>Danh sách chu kỳ dữ liệu</TitleHeader>
      <CTable
        loading={isPending}
        rowKey={'id'}
        columns={getColumnsTableLockPeriod(params, handleEdit)}
        dataSource={dataTable}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements ?? 0,
        }}
      />
    </div>
  );
};
