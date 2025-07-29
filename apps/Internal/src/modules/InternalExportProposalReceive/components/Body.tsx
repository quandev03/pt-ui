import CTable from "@react/commons/Table";
import { useCallback, useMemo, useState } from "react";
import { getColumnsTableInternalExportProposal } from "../constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import { decodeSearchParams, queryParams } from "@react/helpers/utils";
import useList from "../hook/useList";
import { AnyElement } from "@react/commons/types";
import { pathRoutes } from "apps/Internal/src/constants/routes";
import useStoreInternalExportProposal from "../store";
import { ColumnsType } from "antd/es/table";
import ModalViewApprovalProcess from "apps/Internal/src/components/ModalViewApprovalProcess";
const Body = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const params = decodeSearchParams(searchParams)
  const { setIsOpenModalApprovalProgress, isOpenModalApprovalProgress } = useStoreInternalExportProposal()
  const handleDetail = useCallback((record: AnyElement) => {
    navigate(pathRoutes.internalExportProposalReceiveView(record.id))
  }, [navigate])
  const [recordId, setRecordId] = useState<number>()
  const handleProcessApproval = useCallback((record: AnyElement) => {
    setRecordId(record.id)
    setIsOpenModalApprovalProgress(true)
  }, [setIsOpenModalApprovalProgress, recordId])
  const columns: ColumnsType<AnyElement> = useMemo(() => {
    return getColumnsTableInternalExportProposal(params, {
      onDetail: handleDetail,
      onProcessApproval: handleProcessApproval
    });
  }, [params, handleDetail, handleProcessApproval])
  const { data: listData, isFetching } = useList(queryParams(params))
  const dataTable = useMemo(() => {
    if (!listData) return []
    return listData
  }, [listData])
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
          total: dataTable.totalElements ?? 0
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
