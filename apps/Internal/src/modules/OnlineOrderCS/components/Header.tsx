import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { BtnGroupFooter, TitleHeader } from '@react/commons/Template/style';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Tooltip } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useListChannles } from '../queryHooks';
import { CButtonExport } from '@react/commons/Button';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { prefixSaleServicePrivate } from '@react/url/app';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(REACT_QUERY_KEYS.SEARCH_ORDER_CS);
  const { mutate: downloadFile } = useExportMutation();

  const { data: optionOrderStatus } = useParameterQuery({
    'table-name': 'SALE_ORDER',
    'column-name': 'DELIVERY_STATUS',
    enabled: true,
  });

  const { data: optionDVVC } = useParameterQuery({
    'table-name': 'SALE_ORDER',
    'column-name': 'DELIVERY_PARTNER_CODE',
    enabled: true,
  });

  const optionOrderStatusSort = useMemo(() => {
    return (optionOrderStatus || []).sort(
      (a, b) => Number(a.value) - Number(b.value)
    );
  }, [optionOrderStatus]);

  const { data: optionSalesChannel } = useListChannles();

  const disabledDate: RangePickerProps['disabledDate'] = (date: Dayjs) => {
    const sixMonthsAgo = dayjs().subtract(6, 'month').startOf('day');
    return (
      dayjs(date).isAfter(dayjs().endOf('day')) || date.isBefore(sixMonthsAgo)
    );
  };

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái đơn hàng',
      value: (
        <Form.Item name="status" className={'!w-40'}>
          <CSelect
            options={optionOrderStatusSort}
            placeholder="Trạng thái đơn hàng"
            filterOption={(input: any, option: any) =>
              (option?.label?.toLowerCase() ?? '').includes(
                input?.toLowerCase()
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kênh bán',
      value: (
        <Form.Item name="channel" className={'!w-40'}>
          <CSelect
            options={optionSalesChannel}
            placeholder="Chọn kênh"
            filterOption={(input: any, option: any) =>
              (option?.label?.toLowerCase() ?? '').includes(
                input?.toLowerCase()
              )
            }
            filterSort={(optionA: any, optionB: any) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>
      ),
    },
    {
      label: 'Đơn vị vận chuyển',
      value: (
        <Form.Item name="partner" className={'!w-40'}>
          <CSelect
            options={optionDVVC}
            filterOption={(input: any, option: any) =>
              (option?.label?.toLowerCase() ?? '').includes(
                input?.toLowerCase()
              )
            }
            filterSort={(optionA: any, optionB: any) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            placeholder="Chọn đơn vị vận chuyển"
            defaultValue={undefined}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Thời gian đặt hàng',
      value: (
        <Form.Item
          name="orderTime"
          className={'!w-72'}
          initialValue={[dayjs(), dayjs()]}
        >
          <CRangePicker
            readOnly
            format={formatDate}
            inputReadOnly
            disabledDate={disabledDate}
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
        status:
          optionOrderStatus?.find(
            (item: any) => item.value === String(params.status)
          )?.value || null,
        partner:
          optionDVVC?.find((item: any) => item.value === String(params.partner))
            ?.value || null,
        channel:
          optionSalesChannel?.find(
            (item: any) => item.value === String(params.channel)
          )?.value || null,
        orderTime: [from, to],
      });
    }
  }, [params]);

  const handleExportExcel = () => {
    const { page, size, ...rest } = params;
    downloadFile({
      uri: `${prefixSaleServicePrivate}/sale-orders/online-order/cs-order/export`,
      params: queryParams(rest),
      filename: 'Danh_sach_don_hang_online_cs.xlsx',
    });
  };

  return (
    <>
      <TitleHeader>Danh sách đơn hàng online CS</TitleHeader>
      <div className="flex flex-wrap justify-between">
        <Form
          form={form}
          onFinish={onFinish}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.SEARCH_ORDER_CS}
            searchComponent={
              <Tooltip
                title="Nhập mã đơn hàng, SĐT, sô liên hệ để tìm kiếm"
                placement="right"
                overlayClassName="quickSearchOverlay"
              >
                <Form.Item name="q">
                  <CInput
                    placeholder="Nhập mã đơn hàng, SĐT, sô liên hệ để tìm kiếm"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
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
