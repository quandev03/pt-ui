import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { BtnGroupFooter, TitleHeader } from '@react/commons/Template/style';
import { ParamsOption } from '@react/commons/types';
import { DateFormat } from '@react/constants/app';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { prefixSaleServicePrivate } from '@react/url/app';
import { Form, Tooltip } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useListChannles } from '../queryHooks';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.SEARCH_ORDER_AT_STORE
  );
  const { mutate: downloadFile } = useExportMutation();

  const { SALE_ORDER_STORE_STATUS = [] } = useGetDataFromQueryKey<ParamsOption>(
    [REACT_QUERY_KEYS.GET_PARAMS]
  );

  const { data: optionSalesChannel } = useListChannles();

  const disabledDate: RangePickerProps['disabledDate'] = (date: Dayjs) => {
    const sixMonthsAgo = dayjs().subtract(6, 'month').startOf('day');
    return (
      dayjs(date).isAfter(dayjs().endOf('day')) || date.isBefore(sixMonthsAgo)
    );
  };

  const items: ItemFilter[] = [
    {
      label: 'Kênh bán',
      value: (
        <Form.Item name="channel" className={'!w-40'}>
          <CSelect options={optionSalesChannel} placeholder="Chọn kênh" />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái đơn hàng',
      showDefault: true,
      value: (
        <Form.Item name="status" className={'!w-40'}>
          <CSelect
            options={SALE_ORDER_STORE_STATUS}
            placeholder="Trạng thái đơn hàng"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Thời gian đặt hàng',
      showDefault: true,
      value: (
        <Form.Item
          name="orderTime"
          className={'!w-72'}
          initialValue={[dayjs(), dayjs()]}
        >
          <CRangePicker
            readOnly
            format={formatDate}
            disabledDate={disabledDate}
            allowClear={false}
          />
        </Form.Item>
      ),
    },
  ];

  const onFinish = (val: any) => {
    const { q, orderTime } = val;
    const data = {
      ...val,
      page: 0,
      orderTime: undefined,
      q: q && q.trim(),
      queryTime: dayjs().format(DateFormat.TIME),
      fromDate:
        orderTime && orderTime[0]
          ? dayjs(orderTime[0]).startOf('day').format(formatDateEnglishV2)
          : undefined,
      toDate:
        orderTime && orderTime[1]
          ? dayjs(orderTime[1]).endOf('day').format(formatDateEnglishV2)
          : undefined,
    };
    handleSearch(data);
  };

  useEffect(() => {
    if (params) {
      const { fromDate, toDate, ...rest } = params;
      const from = fromDate
        ? dayjs(fromDate, formatDateEnglishV2)
        : dayjs().subtract(29, 'day');
      const to = toDate ? dayjs(toDate, formatDateEnglishV2) : dayjs();
      form.setFieldsValue({
        ...rest,
        status: params?.status?.toString(),
        channel: params?.channel?.toString(),
        orderTime: [from, to],
      });
    }
  }, []);

  const handleExportExcel = () => {
    const { page, size, ...rest } = params;
    downloadFile({
      uri: `${prefixSaleServicePrivate}/sale-orders/online-order/at-store/export`,
      params: queryParams(rest),
      filename: 'Danh_sach_don_hang_online_nhan_tai_cua_hang.xlsx',
    });
  };

  const handleRefresh = () => {
    form.resetFields();
    handleSearch({
      q: '',
      page: 0,
      size: 20,
      queryTime: dayjs().format(DateFormat.TIME),
      fromDate: dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate: dayjs().format(formatDateEnglishV2),
      status: '',
      channel: '',
    });
  };

  return (
    <>
      <TitleHeader>Danh sách đơn hàng nhận tại cửa hàng</TitleHeader>
      <div className="flex flex-wrap justify-between">
        <Form
          form={form}
          onFinish={onFinish}
          validateTrigger={['onSubmit', 'onBlur']}
          initialValues={{
            orderTime: [dayjs().subtract(29, 'day'), dayjs()],
          }}
        >
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.SEARCH_ORDER_CS}
            onRefresh={handleRefresh}
            searchComponent={
              <Tooltip
                title="Nhập mã đơn hàng, SĐT, số liên hệ để tìm kiếm"
                placement="right"
                overlayClassName="quickSearchOverlay"
              >
                <Form.Item name="q">
                  <CInput
                    placeholder="Nhập mã đơn hàng, SĐT, số liên hệ để tìm kiếm"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    maxLength={100}
                    onBlur={() => {
                      form.setFieldValue('q', form.getFieldValue('q')?.trim());
                    }}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        <BtnGroupFooter>
          <CButtonExport onClick={handleExportExcel}>Xuất excel</CButtonExport>
        </BtnGroupFooter>
      </div>
    </>
  );
};

export default Header;
