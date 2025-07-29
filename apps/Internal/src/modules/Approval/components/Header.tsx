import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CRangePicker } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { Col, Form, Row } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { useEffect } from 'react';
import { filterFalsy } from '@react/utils/index';
import dayjs from 'dayjs';
import { MESSAGE } from '@react/utils/message';
import { SearchTimeMax, DateFormat } from '@react/constants/app';
import { toLocalString } from '@react/utils/datetime';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { time } = Form.useWatch((e) => e, form) ?? {};
  const { isLoading: isLoadingProcess, data: dataProcess } = useParameterQuery({
    'table-name': 'APPROVAL_PROCESS',
    'column-name': 'PROCESS_CODE',
  });
  const { isLoading: isLoadingCurrentStatus, data: listCurrentStatus } =
    useParameterQuery({
      'table-name': 'APPROVAL_HISTORY_STEP',
      'column-name': 'STATUS',
    });
  const { isLoading: isLoadingLastStatus, data: listLastStatus } =
    useParameterQuery({
      'table-name': 'APPROVAL_HISTORY',
      'column-name': 'STATUS',
    });

  useEffect(() => {
    if (!time) form.setFieldValue('time', [dayjs().subtract(29, 'd'), dayjs()]);
  }, [time]);
  useEffect(() => {
    const { fromDate, toDate, ...restParams } = params;
    form.setFieldsValue({
      ...restParams,
      time:
        fromDate && fromDate
          ? [dayjs(fromDate).subtract(7, 'h'), dayjs(toDate).subtract(7, 'h')]
          : [dayjs().subtract(29, 'd'), dayjs()],
      status: params?.status ? String(params.status) : undefined,
    });
  }, [JSON.stringify(params)]);
  const handleSearch = (values: any) => {
    const { time, ...restValues } = values;
    setSearchParams(
      filterFalsy({
        ...params,
        ...restValues,
        fromDate: time ? toLocalString(dayjs(time[0]).startOf('d')) : undefined,
        toDate: time ? toLocalString(dayjs(time[1]).endOf('d')) : undefined,
        page: 0,
        queryTime: dayjs().format(DateFormat.DATE_TIME),
      })
    );
  };

  const items: ItemFilter[] = [
    {
      key: 'Thời gian',
      label: 'Thời gian',
      showDefault: true,
      value: (
        <Form.Item name="time" label="">
          <CRangePicker className="!w-[268px]" allowClear={false} />
        </Form.Item>
      ),
    },
    {
      key: 'Quy trình',
      label: 'Quy trình',
      showDefault: true,
      value: (
        <Form.Item label="" name="processCode" className="w-[235px]">
          <CSelect
            isLoading={isLoadingProcess}
            options={dataProcess}
            placeholder="Quy trình"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái hiện tại',
      value: (
        <Form.Item label="" name="status" className="w-48">
          <CSelect
            isLoading={isLoadingCurrentStatus}
            options={listCurrentStatus}
            placeholder="Trạng thái hiện tại"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái cuối cùng',
      value: (
        <Form.Item label="" name="statusLast" className="w-48">
          <CSelect
            isLoading={isLoadingLastStatus}
            options={listLastStatus}
            placeholder="Trạng thái cuối cùng"
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <TitleHeader>Quản lý phê duyệt</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <CFilter items={items} />
        </Form>
      </RowHeader>
    </>
  );
};

export default Header;
