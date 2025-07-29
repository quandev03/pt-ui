import CTable from '@react/commons/Table';
import { useSearchParams } from 'react-router-dom';
import React, { useCallback, useMemo, useState } from 'react';
import { useCancelDistributeNumber } from '../queryHook/useCancelDistributeNumber';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { columnsList } from 'apps/Internal/src/modules/DistributeNumber/constants';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import { IFileInfo } from 'apps/Internal/src/app/types';
import ModalViewApprovalProcess from 'apps/Internal/src/components/ModalViewApprovalProcess';
import { useGetDistributeNumber } from 'apps/Internal/src/hooks/useGetDistributeNumber';
import dayjs from 'dayjs';
import { formatDateBe } from '@react/constants/moment';

const Body = () => {
  const [isOpenModalApprovalProgress, setIsOpenModalApprovalProgress] =
    useState<boolean>(false);
  const [recordId, setRecordId] = useState<number>(0);
  const actionByRole = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const handleAction = useCallback(
    (id: number) => {
      setRecordId(id);
      setIsOpenModalApprovalProgress(true);
    },
    [setIsOpenModalApprovalProgress, recordId]
  );
  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const handleDownloadResultFile = useCallback(
    (record?: IFileInfo) => {
      handleDownloadFile({
        uri: record?.fileUrl ?? '',
      });
    },
    [handleDownloadFile]
  );

  const { data: listDistributeNumber, isFetching } = useGetDistributeNumber(
    queryParams({
      ...params,
      from: params.from
        ? dayjs(params.from).startOf('day').format(formatDateBe)
        : dayjs().subtract(29, 'day').startOf('day').format(formatDateBe),
      to: params.to
        ? dayjs(params.to).endOf('day').format(formatDateBe)
        : dayjs().endOf('day').format(formatDateBe),
    })
  );

  const { mutate: postCancelDistributeNumber } = useCancelDistributeNumber();

  const columns = useMemo(() => {
    return columnsList(
      params,
      handleDownloadResultFile,
      actionByRole,
      postCancelDistributeNumber,
      handleAction
    );
  }, [params, actionByRole]);

  return (
    <>
      <CTable
        columns={columns}
        dataSource={listDistributeNumber?.content || []}
        pagination={{
          total: listDistributeNumber?.totalElements,
        }}
        loading={isFetching}
      />
      <ModalViewApprovalProcess
        open={isOpenModalApprovalProgress}
        onClose={() => setIsOpenModalApprovalProgress(false)}
        objectName="ISDN_TRANSACTION"
        id={recordId}
      />
    </>
  );
};
export default Body;
