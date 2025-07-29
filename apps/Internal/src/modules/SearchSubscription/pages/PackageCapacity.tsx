import CTable from '@react/commons/Table';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Row, TableProps, Tooltip } from 'antd';
import { PackageCapacity, PackageDateType } from '../types';
import { CButtonClose } from '@react/commons/Button';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import { Wrapper } from '@react/commons/Template/style';
import { usePackageCapacityQuery } from '../hooks/usePackageCapacityQuery';
import HeaderPackageCapacity from '../components/HeaderPackageCapacity';

const PackageCapacityPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { isFetching, data } = usePackageCapacityQuery(
    id ?? '',
    queryParams({
      ...params,
      typeDate: params.typeDate ?? PackageDateType.START,
      fromDate:
        params.fromDate ?? dayjs().subtract(6, 'M').format(DateFormat.DEFAULT),
      toDate: params.toDate ?? dayjs().format(DateFormat.DEFAULT),
    })
  );

  const columns: TableProps<PackageCapacity>['columns'] = [
    {
      title: 'STT',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index) => params.page * params.size + index + 1,
    },
    {
      title: 'Mã gói cước',
      dataIndex: 'packCode',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Tên gói cước',
      dataIndex: 'packName',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      width: 160,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      width: 160,
    },
    {
      title: 'Ưu đãi còn lại',
      dataIndex: 'remaining',
      width: 160,
    },
    {
      title: 'Tổng ưu đãi',
      dataIndex: 'total',
      width: 160,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      width: 160,
    },
  ];

  return (
    <Wrapper>
      <HeaderPackageCapacity />
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={data?.content}
        loading={isFetching}
        otherHeight={50}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements,
          onChange: (page, pageSize) =>
            setSearchParams(
              {
                ...params,
                page: page - 1,
                size: pageSize,
              },
              { replace: true }
            ),
        }}
      />
      <Row justify="end" className={data?.totalElements ? '' : 'mt-5'}>
        <CButtonClose onClick={() => navigate(-1)} />
      </Row>
    </Wrapper>
  );
};

export default PackageCapacityPage;
