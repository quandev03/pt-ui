import { CTable } from '@react/commons/index';
import useList from '../hook/useList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decodeSearchParams } from '@react/helpers/utils';
import { useCallback, useMemo } from 'react';
import { ColumnsType } from 'antd/es/table';
import { IItemPromotionProgram } from '../types';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import useDownloadFile from '../hook/useDownloadFile';
import { getColumnsTablePromotionProgram } from '../constants';

const Body = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = decodeSearchParams(searchParams);
  const { data: listPromotionProgram, isFetching } = useList(params);
  const dataTable = useMemo(() => {
    if (!listPromotionProgram) return [];
    return listPromotionProgram.content;
  }, [listPromotionProgram]);
  const handleDetail = useCallback(
    (id: string) => {
      navigate(pathRoutes.promotionProgramBusinessView(id));
    },
    [navigate]
  );
  const handleEdit = useCallback(
    (id: string) => {
      navigate(pathRoutes.promotionProgramBusinessEdit(id));
    },
    [navigate]
  );

  const { mutate } = useDownloadFile();
  const handleDownLoad = useCallback(
    (record: IItemPromotionProgram) => {
      mutate({ id: String(record.id) });
    },
    [mutate]
  );
  const columns: ColumnsType<IItemPromotionProgram> = useMemo(() => {
    return getColumnsTablePromotionProgram(params, {
      onDetail: handleDetail,
      onEdit: handleEdit,
      onDownload: handleDownLoad,
    });
  }, [params, handleDetail]);
  return (
    <div>
      <CTable
        loading={isFetching}
        columns={columns}
        rowKey={'id'}
        dataSource={dataTable ?? []}
        pagination={{
          current: +params.page + 1,
          pageSize: +params.size,
          total: listPromotionProgram?.totalElements ?? 0,
        }}
        otherHeight={50}
      />
    </div>
  );
};
export default Body;
