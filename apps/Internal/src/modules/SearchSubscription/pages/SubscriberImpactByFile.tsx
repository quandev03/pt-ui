import CTable from '@react/commons/Table';
import HeaderSubscriberImpactByFile from '../components/HeaderSubscriberImpactByFile';
import { useSubscriberImpactByFileQuery } from '../hooks/useSubscriberImpactByFileQuery';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Row, Space, TableProps, Tooltip } from 'antd';
import { SubscriberImpactByFile } from '../types';
import { CButtonClose } from '@react/commons/Button';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import { Wrapper } from '@react/commons/Template/style';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { getDate } from '@react/utils/datetime';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { prefixCustomerService } from '@react/url/app';
import { ModelStatus } from '@react/commons/types';

const SubscriberImpactByFilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { isPending, mutate } = useExportMutation();
  const { data: impactTypeData } = useGetApplicationConfig('SUB_ACTION');
  const { isFetching, data } = useSubscriberImpactByFileQuery(
    queryParams({
      ...params,
      fromDate:
        params.fromDate ?? dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
      toDate: params.toDate ?? dayjs().format(DateFormat.DEFAULT),
    })
  );

  const handleExport = (path: string, filename?: string) => {
    mutate({
      uri: `${prefixCustomerService}/file${path}`,
      filename,
    });
  };

  const columns: TableProps<SubscriberImpactByFile>['columns'] = [
    {
      title: 'STT',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index) => params.page * params.size + index + 1,
    },
    {
      title: 'Loại tác động',
      dataIndex: 'actionType',
      width: 120,
      render: (value) =>
        impactTypeData?.find((item) => item.code === value)?.name,
    },
    {
      title: 'Tên file',
      width: 180,
      render: (_, { fileName, uploadPathFile }) => (
        <Tooltip title={fileName} placement="topLeft">
          <span
            className="text-link underline cursor-pointer"
            onClick={() => handleExport(uploadPathFile, fileName)}
          >
            {fileName}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'User thực hiện',
      dataIndex: 'createdBy',
      width: 180,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'executionDate',
      width: 160,
      render: (value) => getDate(value, DateFormat.DATE_TIME),
    },
    {
      title: 'Lý do',
      width: 200,
      render: (_, { reasonName, reasonNote }) => (
        <Tooltip title={reasonNote ?? reasonName} placement="topLeft">
          {reasonNote ?? reasonName}
        </Tooltip>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 220,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'status',
      width: 160,
      render: (value) =>
        value === ModelStatus.ACTIVE ? 'Hoàn thành' : 'Đang xử lý',
    },
    {
      title: 'Kết quả',
      width: 200,
      render: (_, { status, successCount, failedCount, resultPathFile }) =>
        status === ModelStatus.ACTIVE && (
          <Space direction="vertical" size={0}>
            <div>Số lượng thành công: {successCount}</div>
            <div>Số lượng thất bại: {failedCount}</div>
            <Space size={5}>
              File kết quả:
              <span
                className="text-link underline cursor-pointer"
                onClick={() =>
                  handleExport(
                    resultPathFile,
                    `ket_qua_thuc_hien_theo_file-${dayjs().format(
                      DateFormat.EXPORT
                    )}.xlsx`
                  )
                }
              >
                File
              </span>
            </Space>
          </Space>
        ),
    },
  ];

  return (
    <Wrapper>
      <HeaderSubscriberImpactByFile />
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={data?.content}
        loading={isFetching || isPending}
        otherHeight={50}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements,
        }}
      />
      <Row justify="end" className={data?.totalElements ? '' : 'mt-5'}>
        <CButtonClose onClick={() => navigate(-1)} />
      </Row>
    </Wrapper>
  );
};

export default SubscriberImpactByFilePage;
