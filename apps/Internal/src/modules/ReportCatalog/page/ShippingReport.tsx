import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker, CTable } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import {
  RowHeader,
  Text,
  TitleHeader,
  Wrapper,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { formatDateEnglishV2, formatDateTime } from '@react/constants/moment';
import {
  decodeSearchParams,
  formatCurrencyVND,
  queryParams,
} from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { Button, Form, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs, { Dayjs } from 'dayjs';
import { includes } from 'lodash';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IParamsPartnerOrderReport } from '../hook/useGetContentPartnerOrderReport';
import {
  IShippingReport,
  useDownloadShippingReport,
  useGetContentShippingReport,
} from '../hook/useGetShippingReport';
import { CButtonDetail } from '@react/commons/Button';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useEffect } from 'react';

const ShippingReport: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actionByRole = useRolesByRouter();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: shippingReport, isLoading } = useGetContentShippingReport({
    ...queryParams({
      ...params,
      fromDate: params.fromDate
        ? dayjs(params.fromDate).format(formatDateEnglishV2)
        : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate: params.toDate
        ? dayjs(params.toDate).format(formatDateEnglishV2)
        : dayjs().format(formatDateEnglishV2),
    }),
  });

  const handleSubmit = (
    values: IParamsPartnerOrderReport & { period: [Dayjs, Dayjs] }
  ) => {
    const { period, ...res } = values;
    setSearchParams({
      ...params,
      ...res,
      page: 0,
      queryTime: dayjs().format(DateFormat.TIME),
      toDate:
        period && period[1]
          ? dayjs(period[1]).format(formatDateEnglishV2)
          : dayjs().format(formatDateEnglishV2),
      fromDate:
        period && period[0]
          ? dayjs(period[0]).format(formatDateEnglishV2)
          : dayjs().format(formatDateEnglishV2),
    });
  };

  const handleRefresh = () => {
    form.resetFields();
    const values = form.getFieldsValue();
    setSearchParams({
      ...params,
      ...values,
      page: 0,
      size: 20,
      queryTime: dayjs().format(DateFormat.TIME),
      period: undefined,
      fromDate: dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate: dayjs().format(formatDateEnglishV2),
      q: '',
      status: '',
      partner: '',
    });
  };

  const {
    DELIVERY_REPORT_DELIVERY_STATUS = [],
    SALE_ORDER_DELIVERY_PARTNER_CODE = [],
    SALE_ORDER_DELIVERY_METHOD = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái đơn hàng',
      showDefault: true,
      value: (
        <Form.Item name="status" className="min-w-52">
          <CSelect
            options={DELIVERY_REPORT_DELIVERY_STATUS}
            placeholder={'Chọn trạng thái đơn hàng'}
            className="w-full"
            allowClear={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Đơn vị vận chuyển',
      value: (
        <Form.Item name="partner" className="min-w-52">
          <CSelect
            className="w-full"
            options={SALE_ORDER_DELIVERY_PARTNER_CODE}
            placeholder={'Chọn đơn vị vận chuyển'}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Thời gian đặt hàng',
      showDefault: true,
      value: (
        <Form.Item name="period">
          <CRangePicker allowClear={false} className="w-full" />
        </Form.Item>
      ),
    },
  ];

  const { mutate: downloadReport } = useDownloadShippingReport();
  const handleDownload = () => {
    downloadReport({
      ...params,
      filters: undefined,
      fromDate: params.fromDate
        ? dayjs(params.fromDate).format(formatDateEnglishV2)
        : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate: params.toDate
        ? dayjs(params.toDate).format(formatDateEnglishV2)
        : dayjs().format(formatDateEnglishV2),
      format: 'XLSX',
    });
  };

  const columns: ColumnsType<IShippingReport> = [
    {
      title: 'STT',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Thời gian đặt hàng',
      dataIndex: 'orderDate',
      width: 170,
      render(value, record) {
        const textFormatDate = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={textFormatDate} placement="topLeft">
            <Text>{textFormatDate}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian tạo đơn giao hàng',
      dataIndex: 'deliveryCreatedDate',
      width: 180,
      render(value, record) {
        const textFormatDate = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={textFormatDate} placement="topLeft">
            <Text>{textFormatDate}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian lấy hàng',
      dataIndex: 'deliveryPickupDate',
      width: 170,
      render(value, record) {
        const textFormatDate = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={textFormatDate} placement="topLeft">
            <Text>{textFormatDate}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Mã vận đơn',
      dataIndex: 'deliveryNo',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Đơn vị vận chuyển',
      dataIndex: 'partner',
      width: 170,
      render(value) {
        const text =
          SALE_ORDER_DELIVERY_PARTNER_CODE.find((item) => item.value == value)
            ?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Phương thức vận chuyển',
      dataIndex: 'deliveryMethod',
      width: 200,
      render(value) {
        const text =
          SALE_ORDER_DELIVERY_METHOD.find((item) => item.value == value)
            ?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Địa chỉ gửi',
      dataIndex: 'sendAddress',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Địa chỉ nhận',
      dataIndex: 'receiveAddress',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'PTTT',
      dataIndex: 'paymentMethod',
      width: 80,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thu COD',
      dataIndex: 'codAmount',
      width: 80,
      align: 'right',
      render(value, record) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 80,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tổng tiền đơn hàng',
      dataIndex: 'amountTotal',
      width: 150,
      align: 'right',
      render(value, record) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'deliveryFee',
      width: 150,
      align: 'right',
      render(value, record) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Cước chính',
      dataIndex: 'mainFee',
      width: 150,
      align: 'right',
      render(value, record) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Cước thu hộ COD',
      dataIndex: 'codFee',
      width: 150,
      align: 'right',
      render(value, record) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Cước khác',
      dataIndex: 'otherFee',
      width: 150,
      align: 'right',
      render(value, record) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tổng cước',
      dataIndex: 'totalFee',
      width: 150,
      align: 'right',
      render(value, record) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render(value, record) {
        const text =
          DELIVERY_REPORT_DELIVERY_STATUS.find((item) => item.value == value)
            ?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian trạng thái cuối',
      dataIndex: 'lastUpdated',
      width: 200,
      render(value, record) {
        const textFormatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <Tooltip title={textFormatDateTime} placement="topLeft">
            <Text>{textFormatDateTime}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Lý do',
      dataIndex: 'note',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      width: 100,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() => {
                navigate(pathRoutes.shippingReportDetail(record.id));
              }}
            />
          </WrapperActionTable>
        );
      },
    },
  ];

  useEffect(() => {
    form.setFieldsValue({
      ...params,
      status: params.status ? String(params.status) : null,
      partner: params.partner ? String(params.partner) : null,
    });
    if (params.fromDate && params.toDate) {
      form.setFieldValue('period', [
        dayjs(params.fromDate),
        dayjs(params.toDate),
      ]);
    }
  }, []);

  return (
    <Wrapper>
      <TitleHeader>Báo cáo vận chuyển</TitleHeader>
      <RowHeader>
        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={{
            period: [dayjs().subtract(29, 'day'), dayjs()],
          }}
        >
          <CFilter
            items={items}
            onRefresh={handleRefresh}
            searchComponent={
              <Tooltip
                title="Nhập mã đơn hàng, mã vận đơn để tìm kiếm"
                placement="topLeft"
              >
                <Form.Item name="q" className="min-w-72">
                  <CInput
                    maxLength={100}
                    placeholder="Nhập mã đơn hàng, mã vận đơn để tìm kiếm"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        {includes(actionByRole, ActionsTypeEnum.EXPORT_EXCEL) && (
          <Button
            icon={<FontAwesomeIcon icon={faUpload} />}
            type="primary"
            onClick={handleDownload}
          >
            Xuất báo cáo
          </Button>
        )}
      </RowHeader>
      <CTable
        columns={columns}
        dataSource={shippingReport?.content ?? []}
        loading={isLoading}
        rowKey={'id'}
        otherHeight={10}
        pagination={{
          total: shippingReport?.totalElements ?? 0,
        }}
      />
    </Wrapper>
  );
};

export default ShippingReport;
