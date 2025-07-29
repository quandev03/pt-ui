import { CModalConfirm } from '@react/commons/index';
import CTable from '@react/commons/Table';
import { AnyElement } from '@react/commons/types';
import { DeliveryOrderStatusList } from '@react/constants/status';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { ColumnsType } from 'antd/es/table';
import ModalViewApprovalProcess from 'apps/Internal/src/components/ModalViewApprovalProcess';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getColumnsTableInternalExportProposal } from '../constants';
import { useCancel } from '../hook/useCancel';
import useList from '../hook/useList';
import useStoreInternalExportProposal from '../store';
import { useGetLabelStatus } from '../hook/useGetLabelStatus';

const Body = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = decodeSearchParams(searchParams);
  const { mutate: onCancel } = useCancel();
  const { setIsOpenModalApprovalProgress, isOpenModalApprovalProgress } =
    useStoreInternalExportProposal();
  const handleDetail = useCallback(
    (record: AnyElement) => {
      navigate(pathRoutes.internalExportProposalView(record.id));
    },
    [navigate]
  );
  const [recordId, setRecordId] = useState<number>();
  const handleProcessApproval = useCallback(
    (record: AnyElement) => {
      setRecordId(record.id);
      setIsOpenModalApprovalProgress(true);
    },
    [setIsOpenModalApprovalProgress, recordId]
  );
  const handleCopy = useCallback(
    (record: AnyElement) => {
      navigate(pathRoutes.internalExportProposalCopy(record.id));
    },
    [navigate]
  );
  const handleCancel = useCallback(
    (record: AnyElement) => {
      CModalConfirm({
        message: 'Bạn có chắc chắn muốn Hủy đề nghị này không?',
        onOk: () =>
          onCancel({
            id: record.id,
            status: DeliveryOrderStatusList.CANCEL,
          }),
      });
    },
    [onCancel]
  );

  const labelStatus = useGetLabelStatus();
  const columns: ColumnsType<AnyElement> = useMemo(() => {
    return getColumnsTableInternalExportProposal(params, labelStatus, {
      onCopy: handleCopy,
      onCancel: handleCancel,
      onDetail: handleDetail,
      onProcessApproval: handleProcessApproval,
    });
  }, [params, handleCopy, handleCancel, handleDetail, handleProcessApproval]);
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
      <ModalViewApprovalProcess
        open={isOpenModalApprovalProgress}
        onClose={() => setIsOpenModalApprovalProgress(false)}
        objectName="DELIVERY_ORDER"
        id={recordId}
      />
    </div>
  );
};
export default Body;
