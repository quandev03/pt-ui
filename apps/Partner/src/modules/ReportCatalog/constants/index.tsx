import { ItemFilter } from '@react/commons/Filter';
import { CRangePicker, CTag } from '@react/commons/index';
import { Text } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { DateFormat, StatusEnum } from '@react/constants/app';
import { formatDate } from '@react/constants/moment';
import { Form, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getColorStatusApproval } from '../types';

const today = dayjs();
const defaultFromDate = today.subtract(29, 'day').startOf('day');
const defaultToDate = today.endOf('day');

const validateDateRange = (_: any, value: string | any[]) => {
  if (!value || value.length < 2) {
    return Promise.resolve();
  }
  const [fromDate, toDate] = value;
  const diff = dayjs(toDate).diff(dayjs(fromDate), 'day');
  if (diff < 0) {
    return Promise.reject(new Error('Từ ngày không được lớn hơn Đến ngày'));
  }
  if (diff > 30) {
    return Promise.reject(
      new Error('Thời gian tìm kiếm không được vượt quá 30 ngày')
    );
  }
  return Promise.resolve();
};
export const filterSubscriberTopUpReport: ItemFilter[] = [
  {
    label: 'Thời gian',
    value: (
      <Form.Item
        name="time"
        className={'!w-72'}
        initialValue={[defaultFromDate, defaultToDate]}
        rules={[{ validator: validateDateRange }]}
      >
        <CRangePicker
          format={formatDate}
          allowClear={false}
        />
      </Form.Item>
    ),
   showDefault:true
  },
];

export const getColumnsTableReportPackageResult = (params: {
  page: number;
  size: number;
},
handleDownloadFile:(uri:string)=>void,
BATCH_PACKAGE_SALE_STATUS:AnyElement
): ColumnsType<AnyElement> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên file',
      dataIndex: 'fileName',
      width: 150,
      render(value, record) {
        return (
          <div className='cursor-pointer'>
            <Tooltip title={value} placement="topLeft">
              <Text className='text-blue underline' onClick={()=>handleDownloadFile(record.fileUrl)}>{value}</Text>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: 'User thực hiện',
      dataIndex: 'createdBy',
      width: 150,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'createdDate',
      width: 150,
      render(value, record) {
        const text = value ? dayjs(value).format(DateFormat.DATE_TIME) : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'status',
      width: 150,
      render(value, record) {
        const text = BATCH_PACKAGE_SALE_STATUS.find((item:AnyElement) => Number(item.value) === value)?.label;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag color={getColorStatusApproval(value)}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
        title: 'Kết quả thực hiện',
        width: 150,
        align: 'left',
        render: (_, record) => {
          console.log(record,"render")
          const succeededNumber = record?.succeededNumber;
          const failedNumber = record?.failedNumber;
          const checkStatuts = !!record?.status;
          return (
            <div>
                <div className="flex flex-col items-start">
                  <Tooltip
                    placement="topLeft"
                    title={`Số lượng thành công: ${succeededNumber}`}
                  >
                    <Text>Số lượng thành công: {succeededNumber}</Text>
                  </Tooltip>
                  <Tooltip
                    placement="topLeft"
                    title={`Số lượng thất bại: ${failedNumber ?? ''}`}
                  >
                    <Text>Số lượng thất bại: {failedNumber}</Text>
                  </Tooltip>
                  <Text>
                    File kết quả:
                    {checkStatuts && <Typography.Text
                      style={{
                        color: 'green',
                        textDecoration: 'underline',
                        fontStyle: 'italic',
                        marginLeft: '4px',
                      }}
                      onClick={()=>handleDownloadFile(record.resultFileUrl)}
                      className="text-red-600 underline cursor-pointer"
                    >
                      File
                    </Typography.Text>}
                  </Text>
                </div>
            </div>
          );
        },
      },
  
  ];
};
