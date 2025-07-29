import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { RowHeader, TitleHeader, Wrapper } from '@react/commons/Template/style';
import { formatDateISO } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { APP_CODE } from 'apps/Internal/src/constants';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useColumnsAccessLog } from '../hooks/useColumnsAccessLog';
import {
  IAccessItem,
  IParamsAccessLog,
  useGetAccessLog,
  useGetAccessLogKey,
} from '../hooks/useGetAccessLog';
import { useGetAllPartner } from '../hooks/useGetAllPartner';
import { useGetAllUserOption } from '../hooks/useGetAllUserOption';
import { useGetEventLogs } from '../hooks/useGetEventLogs';
import { useGetSites } from '../hooks/useGetSites';
import CInput from '@react/commons/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const AudiLogList = () => {
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const clientCode = Form.useWatch('clientCode', form);
  const siteCode = Form.useWatch('siteCode', form);
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(useGetAccessLogKey);

  const startDateSubtract = useMemo(() => {
    return dayjs().startOf('day').subtract(29, 'day').format(formatDateISO);
  }, []);
  const endDate = useMemo(() => {
    return dayjs().endOf('day').format(formatDateISO);
  }, []);

  const { data: AccessLog, isLoading: loadingTable } = useGetAccessLog(
    queryParams<IParamsAccessLog>({
      ...params,
      startTime: params.startTime
        ? dayjs(params.startTime).startOf('day').format(formatDateISO)
        : startDateSubtract,
      endTime: params.endTime
        ? dayjs(params.endTime).endOf('day').format(formatDateISO)
        : endDate,
      siteCode: params.siteCode ? params.siteCode : APP_CODE,
    })
  );

  const { data: eventLogs = [], isLoading: loadingEventLogs } =
    useGetEventLogs();
  const { data: partnerOptions = [], isLoading: loadingPartnerOptions } =
    useGetAllPartner();
  const { data: sites = [] } = useGetSites();

  const columns: ColumnsType<IAccessItem> = useColumnsAccessLog(eventLogs);

  useEffect(() => {
    const { startTime, endTime, clientId, ...rest } = params;
    form.setFieldsValue({
      ...rest,
      clientId: clientId ? Number(clientId) : null,
    });
    if (startTime && endTime) {
      form.setFieldsValue({
        time: [startTime, endTime].map(
          (item) => item && dayjs(item, formatDateISO)
        ),
      });
    }
  }, []);

  const handleFinish = (values: Record<string, string | [Dayjs, Dayjs]>) => {
    const { time, ...payload } = values;
    if (time && time.length === 2) {
      payload.startTime = (time as [Dayjs, Dayjs])[0]
        ?.startOf('day')
        .format(formatDateISO);
      payload.endTime = (time as [Dayjs, Dayjs])[1]
        ?.endOf('day')
        .format(formatDateISO);
    }
    handleSearch(payload);
  };

  const handleRefresh = () => {
    form.resetFields();
    handleSearch({
      page: 0,
      size: 20,
      startTime: startDateSubtract,
      endTime: endDate,
      siteCode: APP_CODE,
      actionType: undefined,
      clientCode: undefined,
      username: undefined,
    });
  };

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Loại truy cập',
        value: (
          <Form.Item label="" name="actionType" className="w-56">
            <CSelect
              placeholder="Chọn loại truy cập"
              options={eventLogs}
              loading={loadingEventLogs}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Đối tác',
        value: (
          <Form.Item label="" name="clientCode" className="w-56">
            <CSelect
              placeholder="Chọn đối tác"
              options={siteCode === APP_CODE ? [] : partnerOptions}
              loading={loadingPartnerOptions}
              onChange={() => form.setFieldsValue({ userId: null })}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Nơi truy cập',
        showDefault: true,
        value: (
          <Form.Item label="" name="siteCode" className="w-44">
            <CSelect
              placeholder="Chọn nơi truy cập"
              options={sites}
              allowClear={false}
              onChange={(value) => {
                if (value === APP_CODE) {
                  form.resetFields(['clientCode']);
                }
              }}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Ngày truy cập',
        showDefault: true,
        value: (
          <Form.Item label="" name="time">
            <CRangePicker allowClear={false} />
          </Form.Item>
        ),
      },
    ];
  }, [
    eventLogs,
    loadingEventLogs,
    partnerOptions,
    loadingPartnerOptions,
    siteCode,
  ]);

  return (
    <Wrapper>
      <div>
        <TitleHeader>Log truy cập</TitleHeader>
        <RowHeader>
          <Form
            onFinish={handleFinish}
            form={form}
            initialValues={{
              time: [dayjs().subtract(29, 'day'), dayjs()],
              siteCode: APP_CODE,
            }}
          >
            <CFilter
              items={items}
              validQuery={useGetAccessLogKey}
              onRefresh={handleRefresh}
              searchComponent={
                <Tooltip
                  title="Nhập username hoặc tên người truy cập"
                  placement="right"
                >
                  <Form.Item name="username" className="min-w-72">
                    <CInput
                      maxLength={100}
                      placeholder="Nhập username hoặc tên người truy cập"
                      prefix={<FontAwesomeIcon icon={faSearch} />}
                    />
                  </Form.Item>
                </Tooltip>
              }
            />
          </Form>
        </RowHeader>
        <CTable
          loading={loadingTable}
          columns={columns}
          rowKey={'id'}
          otherHeight={10}
          dataSource={AccessLog?.content || []}
          pagination={{
            total: AccessLog?.totalElements,
          }}
        />
      </div>
    </Wrapper>
  );
};
export default AudiLogList;
