import React from 'react';
import Header from './Header';
import CTable from '@react/commons/Table';
import { Dropdown, Form, Tooltip } from 'antd';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ContentItem } from '../types';
import { CButtonDetail } from '@react/commons/Button';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useForm } from 'antd/es/form/Form';
import { decodeSearchParams } from '@react/helpers/utils';
import { formatDate, formatDateEnglishV2, formatDateTime } from '@react/constants/moment';
import dayjs from 'dayjs';
import { useList } from '../queryHook/useList';
import { ExtendedColumnsType } from '@react/commons/TableSearch';
import CTag from '@react/commons/Tag';
import {ColorList} from '../../../../../../commons/src/lib/constants/color'
import { useGetFileDownloadFn } from '../queryHook/useGetFileDownload';
const Body: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const {data: dataTable, isLoading: loadingTable} = useList(params);
  const { mutate: getFileDownload } = useGetFileDownloadFn();
  const handleDownload = (url: string) => {
    getFileDownload(url);
  };

  const columns: ExtendedColumnsType<ContentItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return <Text disabled={!record?.status}>{index + 1 + params.page * params.size}</Text>;
      },
    },

    {
      title: 'Mã đơn upload',
      dataIndex: 'uploadSourceNo',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={dayjs(value).format(formatDateTime)} placement="topLeft">
            <Text disabled={!record?.status}>{dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Trạng thái kiểm tra',
      dataIndex: 'validSucceedNumber',
      width: 150,
      align: 'left',
      render(value, record) {
        return (
          <CTag color={!value && !record.validFailedNumber ? `${ColorList.PROCESSING}` : record.validFailedNumber > 0 ? `${ColorList.FAIL}` : `${ColorList.SUCCESS}`}>
          <Tooltip title={!value && !record.validFailedNumber ? 'Đang kiểm tra' : record.validFailedNumber > 0 ? 'Thất bại' : 'Thành công'  } placement="topLeft">
            {!value && !record.validFailedNumber ? 'Đang kiểm tra' : record.validFailedNumber > 0 ? 'Thất bại' : 'Thành công'}
          </Tooltip>
          </CTag>
        );
      },
    },

    {
      title: 'Kết quả kiểm tra',
      dataIndex: 'validSucceedNumber',
      width: 180,
      align: 'left',
      render(value, record) {
        if(record.validFailedNumber !== null)
        return (
          <div>
            <div>{`Số lượng thành công: ${value ? value : '0'}`}</div>
            <div>{`Số lượng thất bại: ${record.validFailedNumber ? record.validFailedNumber : '0' }`}</div>
            <div>
              {`File kết quả: `}
              <span
                className="text-primary underline cursor-pointer"
                onClick={() => handleDownload(record.validFileUrl)}
              >
                File
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái thực hiện',
      dataIndex: 'status',
      width: 180,
      align: 'left',
      values: (value) => value === 1 ? 'Chưa thực hiện' : value === 2 ? 'Đang thực hiện' : 'Hoàn thành',
      render(value, record) {
        return (
          <CTag color={value === 1 ? `${ColorList.WAITING}` : value === 2 ? `${ColorList.PROCESSING}` : `${ColorList.SUCCESS}`}>
          <Tooltip title={value === 1 ? 'Chưa thực hiện' : value === 2 ? 'Đang thực hiện' : 'Hoàn thành'} placement="topLeft">
            {value === 1 ? 'Chưa thực hiện' : value === 2 ? 'Đang thực hiện' : 'Hoàn thành'}
          </Tooltip>
          </CTag>
        );
      },
    },
    {
      title: 'Kết quả thực hiện',
      dataIndex: 'succeedNumber',
      width: 180,
      align: 'left',
      render(value, record) {
        if(record.status === 3)
        return (
          <div>
            <div>{`Số lượng thành công: ${value ? value : '0'}`}</div>
            <div>{`Số lượng thất bại: ${record.failedNumber ? record.failedNumber : '0' }`}</div>
            <div>
              {`File kết quả: `}
              <span
                className="text-primary underline cursor-pointer"
                onClick={() => handleDownload(record.fileResultUrl)}
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
      dataIndex: 'action',
      width: 150,
      align: 'center',
      fixed: "right",
      render(value, record) {
        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() => navigate(pathRoutes.simUploadView(record.id))}
            />
          </WrapperActionTable>
        );
      },
    },
  ];
  
  const handleFinish = (values: any) => {
    const { rangePicker, type, ...rest } = values;
    const [startDate, endDate] = rangePicker || [dayjs().subtract(29, 'day'), dayjs()];
    const newType = type ?? '1';
    const filters = params.filters ?? 0;
    setSearchParams({
      ...params,
      ...rest,
      type: newType,
      startDate: startDate.format(formatDateEnglishV2),
      endDate: endDate.format(formatDateEnglishV2),
      filters,
    });
    // handleSearch(params);
  };


  return (
    <>
      <Form form={form} onFinish={handleFinish} initialValues={{type: "1"}}>
        <Form.Item name="type" hidden></Form.Item>
        <Header />
      </Form>
      <CTable
        columns={columns}
        dataSource={dataTable?.content}
        loading={loadingTable}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: dataTable?.totalElements,
        }}
      />
    </>
  );
};

export default Body;
