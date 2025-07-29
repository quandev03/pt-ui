import { CButtonDetail } from '@react/commons/Button';
import { CTable, CTag, CTooltip } from '@react/commons/index';
import {
  ActionsTypeEnum,
  DateFormat,
  KitProcessType,
} from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDate } from '@react/utils/datetime';
import { getKitCraftStatusColor } from '@react/utils/status';
import { Space, TableColumnsType } from 'antd';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useDownloadFile } from '../hooks/useDownloadFile';
import { useListKitCraft } from '../hooks/useListKit';
import { KitCraftType } from '../types';
import { KitCraftStatusList } from '@react/constants/status';

const KitCraftPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    fromDate: dayjs().subtract(29, 'd').format(DateFormat.DATE_ISO),
    toDate: dayjs().format(DateFormat.DATE_ISO),
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
  const handleView = (id: string, record: KitCraftType) => {
    if (record.processType === KitProcessType.BATCH) {
      navigate(pathRoutes.kitCraftGroupView(id));
    } else {
      navigate(pathRoutes.kitCraftView(id));
    }
  };
  const handleGetFile = (record: KitCraftType) => {
    mutateDownloadFile({
      fileType: 'RESULT',
      id: record.id,
      fileName: record.logFileUrl,
    });
  };
  const columns: TableColumnsType<KitCraftType> = [
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
      title: 'Loại ghép KIT',
      dataIndex: 'processType',
      width: 110,
      render: (value: string) => {
        return (
          <CTooltip title={value}>
            {
              allParams?.COMBINE_KIT_PROCESS_TYPE?.find(
                (e) => e.value === String(value)
              )?.label
            }
          </CTooltip>
        );
      },
    },
    {
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Serial',
      dataIndex: 'serial',
      width: 160,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Gói cước',
      dataIndex: 'packageProfileCode',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Loại profile',
      dataIndex: 'profileType',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Loại SIM',
      dataIndex: 'simType',
      width: 140,
      render: (value: number) => {
        const simType = allParams?.PRODUCT_CATEGORY_CATEGORY_TYPE?.find(
          (e) => e.value === String(value)
        )?.label;
        return <CTooltip title={simType}>{simType}</CTooltip>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      render: (value: number) => {
        const statusName = allParams?.COMBINE_KIT_STATUS?.find(
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
      title: 'Người ghép KIT',
      dataIndex: 'createdBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },

    {
      title: 'Ngày ghép KIT',
      dataIndex: 'createdDate',
      width: 120,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME_NO_SECOND)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Kết quả',
      dataIndex: 'succeededNumber',
      width: 170,
      render: (value: string, record: KitCraftType) => {
        if (
          record.processType === 1 ||
          record.status === KitCraftStatusList.PROGRESS
        ) {
          //with TH kit don le or status dang thuc hien thi ko hien thi
          return '';
        }
        const successText = `Số lượng thành công: ${value ?? ''}`;
        const failText = `Số lượng thất bại: ${record.failedNumber}`;
        return (
          <div>
            <CTooltip title={successText}>{successText}</CTooltip>
            <br />
            <CTooltip title={failText}>{failText}</CTooltip>
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
      title: 'Thao tác',
      dataIndex: 'id',
      width: 120,
      align: 'center',
      fixed: 'right',
      hidden: !includes(actions, ActionsTypeEnum.READ),
      render: (value, record) => (
        <Space size="middle">
          <CButtonDetail
            type="default"
            onClick={() => handleView(value, record)}
          />
        </Space>
      ),
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
