import { CTable } from '@react/commons/index';
import { decodeSearchParams } from '@react/helpers/utils';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getColumnsManagerPartnerAirtimeAccount } from '../constants';
import { useList } from '../hook/useList';

export const Body = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const columns = useMemo(() => {
    return getColumnsManagerPartnerAirtimeAccount(params);
  }, [params]);
  const { data: listPartnerAirtimeAccount, isPending } = useList(params);
  const dataTable = useMemo(() => {
    if (!listPartnerAirtimeAccount) return [];
    return listPartnerAirtimeAccount?.content;
  }, [listPartnerAirtimeAccount]);
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
          total: listPartnerAirtimeAccount?.totalElements ?? 0,
        }}
      />
    </>
  );
};
