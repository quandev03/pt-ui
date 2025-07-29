import { CButtonDetail } from '@react/commons/Button';
import { CTable, CTooltip } from '@react/commons/index';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDate, toLocalISOString } from '@react/utils/datetime';
import { Space, TableColumnsType } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useListMerchantTrans } from '../hooks/useListTrans';
import { MerchantTransType } from '../types';

const MerchantTransPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    fromDate: dayjs().subtract(29, 'd').startOf('d').format(),
    toDate: dayjs().endOf('d').format(),
  });
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const allParams = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { data, isFetching: isLoadingList } = useListMerchantTrans(
    queryParams(params)
  );

  const handleView = (id: string) => {
    navigate(pathRoutes.merchantEximTransView(id));
  };

  const columns: TableColumnsType<MerchantTransType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      fixed: 'left',
      render: (_, __, idx: number) => {
        return <div>{page * size + idx + 1}</div>;
      },
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'deliveryNoteCode',
      width: 150,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'stockMoveCode',
      width: 150,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'moveDate',
      width: 100,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DEFAULT)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 120,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: 130,
      align: 'center',
      fixed: 'right',
      render: (value, record) => (
        <Space size="middle">
          <CButtonDetail type="default" onClick={() => handleView(value)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Header />
      <CTable
        rowKey={'id'}
        columns={columns}
        dataSource={data?.content ?? []}
        pagination={{
          current: +page + 1,
          pageSize: +size,
          total: data?.totalElements,
        }}
        loading={isLoadingList}
      />
    </>
  );
};

export default MerchantTransPage;
