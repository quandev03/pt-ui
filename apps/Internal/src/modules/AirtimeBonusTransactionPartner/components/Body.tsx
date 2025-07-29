import { CModalConfirm, CTable } from "@react/commons/index";
import { decodeSearchParams } from "@react/helpers/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import useList from "../hook/useList";
import { useCallback, useMemo, useState } from "react";
import { getColumnsAirtimeBonusTransactionPartner } from "../constants";
import ModalViewApprovalProcess from "apps/Internal/src/components/ModalViewApprovalProcess";
import { useDelete } from "../hook/useDelete";
import { useGetDownloadFile } from "../hook/useDownloadFile";
import { pathRoutes } from "apps/Internal/src/constants/routes";

const Body = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: listData, isPending } = useList(params);
  const [isOpenModalApprovalProgress, setIsOpenModalApprovalProgress] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<number>();
  const { mutate: deleteAction } = useDelete()
  const dataTable = useMemo(() => {
    if (!listData) return [];
    return listData.content;
  }, [listData]);
  const handleApprovalProgress = useCallback((id: number) => {
    setRecordId(id);
    setIsOpenModalApprovalProgress(true);
  }, [setIsOpenModalApprovalProgress, recordId])
  const handleDelete = useCallback((id: number) => {
    CModalConfirm({
      message: "Bạn có chắc chắn muốn hủy giao dịch cộng tiền airtime không?",
      onOk: () => deleteAction(id),
    });
  }, [deleteAction]);
  const { mutate: downloadFile } = useGetDownloadFile()
  const handleDownloadFile = useCallback((payload: {
    id: number;
    fileName: string;
  }) => {
    downloadFile({
      id: payload.id,
      fileName: payload.fileName,
    })
  }, [downloadFile]);
  const navigate = useNavigate();
  const handleView = useCallback((record:any) => {
     navigate(pathRoutes.airtimeBonusTransactionPartnerView(record.id));
  },[navigate])
  const columns = useMemo(() => {
    return getColumnsAirtimeBonusTransactionPartner(params, handleApprovalProgress, handleDelete, handleDownloadFile,handleView);
  }, [params, handleApprovalProgress, handleDelete]);
  return (
    <>
      <CTable
        loading={isPending}
        columns={columns}
        rowKey={'id'}
        dataSource={dataTable ?? []}
        pagination={{
          current: +params.page + 1,
          pageSize: +params.size,
          total: listData?.totalElements ?? 0,
        }}
        otherHeight={100}
      />
      <ModalViewApprovalProcess
        open={isOpenModalApprovalProgress}
        onClose={() => setIsOpenModalApprovalProgress(false)}
        objectName="AIR_TIME_TRANSACTION"
        id={recordId}
      />
    </>
  );
};
export default Body;
