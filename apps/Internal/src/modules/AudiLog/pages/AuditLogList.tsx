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
import dayjs, { Dayjs } from 'dayjs';
import { memo, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModalAuditLogView from '../components/ModalAuditLogView';
import { useColumnsAuditLog } from '../hooks/useColumnsAuditLog';
import {
  IAuditItem,
  IParamsAuditLog,
  useGetAuditLog,
  useGetAuditLogKey,
} from '../hooks/useGetAuditLog';
import { useTypeOfImpact } from '../hooks/useTypeOfImpact';
import { useGetAllPartner } from '../hooks/useGetAllPartner';
import { useGetAllUserOption } from '../hooks/useGetAllUserOption';
import { useWatch } from 'antd/es/form/Form';
import { useGetTargetTypes } from '../hooks/useGetTargetTypes';
import { useGetSites } from '../hooks/useGetSites';
import { APP_CODE } from 'apps/Internal/src/constants';
import CInput from '@react/commons/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const AudiLogList = () => {
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const params = decodeSearchParams(searchParams);
  const siteCode = useWatch('siteCode', form) ?? APP_CODE;
  const { handleSearch } = useSearchHandler(useGetAuditLogKey);

  const startDateSubtract = useMemo(() => {
    return dayjs().subtract(29, 'day').startOf('day').format(formatDateISO);
  }, []);
  const endDate = useMemo(() => {
    return dayjs().endOf('day').format(formatDateISO);
  }, []);

  const handleRefresh = () => {
    handleSearch({
      page: 0,
      size: 20,
      startTime: startDateSubtract,
      endTime: endDate,
      siteCode: APP_CODE,
      username: undefined,
      actionType: undefined,
      clientCode: undefined,
      targetType: undefined,
    });
    form.resetFields();
  };
  const { data, isLoading: loadingTable } = useGetAuditLog(
    queryParams<IParamsAuditLog>({
      ...params,
      startTime: params.startTime
        ? dayjs(params.startTime).format(formatDateISO)
        : startDateSubtract,
      endTime: params.endTime
        ? dayjs(params.endTime).format(formatDateISO)
        : endDate,
      siteCode: params.siteCode ? params.siteCode : APP_CODE,
    })
  );
  const [auditDetail, setAuditDetail] = useState<{
    isOpen: boolean;
    id: string;
  }>({
    isOpen: false,
    id: '',
  });

  const columns: ColumnsType<IAuditItem> = useColumnsAuditLog((record) => {
    setAuditDetail({
      isOpen: true,
      id: record.id,
    });
  });

  const { data: typeOfImpact = [], isLoading: loadingTypeOfImpact } =
    useTypeOfImpact();
  const { data: partners = [], isLoading: loadingPartners } =
    useGetAllPartner();
  const { data: targetTypes = [], isLoading: loadingTargetTypes } =
    useGetTargetTypes(siteCode);
  const { data: sites = [], isLoading: loadingSites } = useGetSites();

  const handleFinish = (values: Record<string, string | [Dayjs, Dayjs]>) => {
    const { time, ...payload } = values;
    if (time || time.length === 2) {
      payload.startTime = (time as [Dayjs, Dayjs])[0]
        ?.startOf('day')
        .format(formatDateISO);
      payload.endTime = (time as [Dayjs, Dayjs])[1]
        ?.endOf('day')
        .format(formatDateISO);
    }
    handleSearch(payload);
  };

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

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Loại tác động',
        value: (
          <Form.Item label="" name="actionType" className="w-48">
            <CSelect
              placeholder="Chọn loại tác động"
              options={typeOfImpact}
              loading={loadingTypeOfImpact}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Đối tác',
        value: (
          <Form.Item label="" name="clientCode" className="w-44">
            <CSelect
              placeholder="Chọn đối tác"
              options={siteCode === APP_CODE ? [] : partners}
              onChange={() => form.resetFields(['userId'])}
              loading={loadingPartners}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Chức năng',
        value: (
          <Form.Item label="" name="targetType" className="w-44">
            <CSelect
              placeholder="Chọn chức năng"
              options={targetTypes}
              loading={loadingTargetTypes}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Nơi tác động',
        showDefault: true,
        value: (
          <Form.Item label="" name="siteCode" className="w-44">
            <CSelect
              placeholder="Chọn nơi tác động"
              options={sites}
              loading={loadingSites}
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
        label: 'Ngày tác động',
        showDefault: true,
        value: (
          <Form.Item label="" name="time" className="w-64">
            <CRangePicker allowClear={false} />
          </Form.Item>
        ),
      },
    ];
  }, [
    partners,
    typeOfImpact,
    targetTypes,
    sites,
    siteCode,
    loadingPartners,
    loadingTypeOfImpact,
    loadingTargetTypes,
    loadingSites,
  ]);

  return (
    <Wrapper>
      <div>
        <TitleHeader>Log thay đổi</TitleHeader>
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
              onRefresh={handleRefresh}
              searchComponent={
                <Tooltip
                  title="Nhập username hoặc tên người tác động"
                  placement="right"
                >
                  <Form.Item name="username" className="min-w-72">
                    <CInput
                      maxLength={100}
                      placeholder="Nhập username hoặc tên người tác động"
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
          dataSource={data?.content || []}
          pagination={{
            total: data?.totalElements,
          }}
        />
      </div>
      <ModalAuditLogView
        isOpen={auditDetail.isOpen}
        onCancel={() => {
          setAuditDetail({ isOpen: false, id: '' });
        }}
        id={auditDetail.id}
      />
    </Wrapper>
  );
};
export default memo(AudiLogList);
