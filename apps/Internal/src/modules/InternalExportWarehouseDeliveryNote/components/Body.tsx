import { CModalConfirm, NotificationSuccess } from '@react/commons/index';
import CTable from '@react/commons/Table';
import { AnyElement } from '@react/commons/types';
import { DeliveryOrderMethod } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { ColumnsType } from 'antd/es/table';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getColumnsTableInternalWarehouseDeliveryNote } from '../constants';
import { useCancel } from '../hook/useCancel';
import useList from '../hook/useList';
import { IDeliveryNoteMethod } from '../type';
const Body = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = decodeSearchParams(searchParams);
  const [record, setRecord] = useState<AnyElement>();
  const { mutate: onCancel } = useCancel(() => {
    NotificationSuccess(
      record.deliveryNoteMethod === IDeliveryNoteMethod.IMPORT
        ? 'Hủy phiếu nhập kho nội bộ thành công'
        : 'Hủy phiếu xuất kho nội bộ thành công'
    );
  });
  const handleDetail = useCallback(
    (record: AnyElement) => {
      if (record.deliveryNoteMethod === DeliveryOrderMethod.IMPORT) {
        navigate(pathRoutes.internalImportWarehouseDeliveryNoteView(record.id));
      } else {
        navigate(pathRoutes.internalWarehouseDeliveryNoteView(record.id));
      }
    },
    [navigate]
  );
  const handleCancel = useCallback(
    (record: AnyElement) => {
      console.log(record);
      CModalConfirm({
        message:
          record.deliveryNoteMethod === IDeliveryNoteMethod.IMPORT
            ? 'Bạn có chắc chắn muốn Hủy phiếu nhập này không?'
            : 'Bạn có chắc chắn muốn Hủy phiếu xuất này không?',
        onOk: () => onCancel(record.id),
      });
      setRecord(record);
    },
    [onCancel]
  );
  const columns: ColumnsType<AnyElement> = useMemo(() => {
    return getColumnsTableInternalWarehouseDeliveryNote(params, {
      onCancel: handleCancel,
      onDetail: handleDetail,
    });
  }, [params, handleCancel, handleDetail]);
  const { data: listData, isFetching } = useList(queryParams(params));
  const dataTable = useMemo(() => {
    if (!listData) return [];
    return listData;
  }, [listData]);
  return (
    <div>
      <CTable
        loading={isFetching}
        columns={columns}
        rowKey={'id'}
        dataSource={dataTable.content ?? []}
        pagination={{
          current: +params.page + 1,
          pageSize: +params.size,
          total: dataTable.totalElements ?? 0,
        }}
      />
    </div>
  );
};
export default Body;
