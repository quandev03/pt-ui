import { CTable, CTag, CTooltip } from '@react/commons/index';
import { DateFormat, SearchTimeMax } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDate } from '@react/utils/datetime';
import { getKitCraftStatusColor } from '@react/utils/status';
import { TableColumnsType } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useDownloadFile } from '../hooks/useDownloadFile';
import { useListKitCraft } from '../hooks/useListKit';
import { KitCraftType } from '../types';
import { ColorList } from '@react/constants/color';
import { ParamsOption } from '@react/commons/types';

const KitCraftPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    startDate: dayjs().subtract(SearchTimeMax, 'M').format(DateFormat.DATE_ISO),
    endDate: dayjs().format(DateFormat.DATE_ISO),
  });
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const actions = useRolesByRouter();
  const allParams = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { data, isFetching: isLoadingList } = useListKitCraft(
    queryParams(params)
  );
  const { isPending: isLoadingFile, mutate: mutateDownloadFile } =
    useDownloadFile();
  const handleGetFile = (record: KitCraftType) => {
    mutateDownloadFile({
      fileUrl: record.logFileUrl,
    });
  };
  const columns: TableColumnsType<KitCraftType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, __, idx: number) => {
        return <div>{page * size + idx + 1}</div>;
      },
    },
    {
      title: 'Kết quả',
      dataIndex: 'succeededNumber',
      width: 160,
      render: (value: string, record: KitCraftType) => {
        if (record.processType === 1) {
          //with TH kit don le thi ko hien thi
          return '';
        }
        return (
          <div>
            <div>{`Số lượng thành công: ${value ?? ''}`}</div>
            <div>{`Số lượng thất bại: ${record.failedNumber}`}</div>
            <div>
              {`File kết quả: `}
              <span
                className="text-primary underline cursor-pointer"
                onClick={() => handleGetFile(record)}
              >
                File
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'transStatus',
      width: 120,
      render: (value: number) => {
        const statusName = allParams?.SIM_REGISTRATION_TRANS_TRANS_STATUS?.find(
          (e) => e.value === String(value)
        )?.label;
        return (
          <CTooltip title={statusName}>
            <CTag color={getKitCraftStatusColor(value) as any}>
              {statusName}
            </CTag>
          </CTooltip>
        );
      },
    },
    {
      title: 'Lý do',
      dataIndex: 'reasonName',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Người hủy ghép KIT',
      dataIndex: 'createdBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },

    {
      title: 'Ngày hủy ghép KIT',
      dataIndex: 'createdDate',
      width: 125,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <CTable
        columns={columns}
        dataSource={data?.content ?? []}
        pagination={{
          current: +page + 1,
          pageSize: +size,
          total: data?.totalElements,
        }}
        loading={isLoadingList || isLoadingFile}
      />
    </>
  );
};
export default KitCraftPage;
