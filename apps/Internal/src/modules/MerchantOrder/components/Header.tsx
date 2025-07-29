import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd, CButtonExport } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import {
  CInput,
  CRangePicker,
  CTooltip,
  DebounceSelect,
} from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { filterFalsy } from '@react/utils/index';
import { Col, Flex, Form, Row } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExportOrder } from '../hooks/useExportOrder';
import { queryKeyListOrder } from '../hooks/useListOrder';
import { useListSupplier } from '../hooks/useListSupplier';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const actions = useRolesByRouter();
  const { time } = Form.useWatch((e) => e, form) ?? {};
  const { mutateAsync: mutateSupplier } = useListSupplier();
  const { mutateAsync: mutateExport, isPending: isLoadingExport } =
    useExportOrder();
  const allParams = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  useEffect(() => {
    if (!time) form.setFieldValue('time', [dayjs().subtract(29, 'd'), dayjs()]);
  }, [time]);

  useEffect(() => {
    const { fromDate, toDate, ...restParams } = params;
    form.setFieldsValue({
      ...restParams,
      time:
        fromDate && fromDate
          ? [dayjs(fromDate), dayjs(toDate)]
          : [dayjs().subtract(29, 'd'), dayjs()],
      supplierId: params?.supplierId ? Number(params.supplierId) : undefined,
    });
  }, [JSON.stringify(params)]);

  const handlePackValue = (values: any) => {
    const { time, ...restValues } = values;
    return filterFalsy({
      ...params,
      ...restValues,
      fromDate: time ? dayjs(time[0]).startOf('d').format() : undefined,
      toDate: time ? dayjs(time[1]).endOf('d').format() : undefined,
      page: 0,
      queryTime: dayjs().format(DateFormat.TIME),
    });
  };
  const handleSearch = (values: any) => {
    setSearchParams(handlePackValue(values));
  };

  const onDownload = () => {
    mutateExport(handlePackValue(form.getFieldsValue()) as any);
  };

  const handleAdd = () => {
    navigate(pathRoutes.merchantOrderAdd);
  };

  const items: ItemFilter[] = [
    {
      key: 'Thời gian',
      label: 'Thời gian',
      showDefault: true,
      value: (
        <Form.Item name="time" label="">
          <CRangePicker allowClear={false} className="!w-[268px]" />
        </Form.Item>
      ),
    },
    {
      key: 'NCC',
      label: 'NCC',
      value: (
        <Form.Item label="" name="supplierId" className="w-40">
          <DebounceSelect
            placeholder="Nhà cung cấp"
            //@ts-ignore
            fetchOptions={mutateSupplier}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái phê duyệt',
      value: (
        <Form.Item label="" name="approvalStatus" className="w-[180px]">
          <CSelect
            options={allParams?.DELIVERY_ORDER_APPROVAL_STATUS ?? []}
            placeholder="Trạng thái phê duyệt"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái đơn hàng',
      value: (
        <Form.Item label="" name="orderStatus" className="w-[176px]">
          <CSelect
            options={allParams?.DELIVERY_ORDER_ORDER_STATUS ?? []}
            placeholder="Trạng thái đơn hàng"
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <TitleHeader>Danh sách đơn mua hàng từ NCC</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <CFilter
                items={items}
                validQuery={queryKeyListOrder}
                searchComponent={
                  <CTooltip title="Nhập mã đơn hàng" placement="right">
                    <Form.Item label="" name="q">
                      <CInput
                        placeholder="Nhập mã đơn hàng"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                        maxLength={100}
                      />
                    </Form.Item>
                  </CTooltip>
                }
              />
            </Col>
          </Row>
        </Form>
        <Flex gap={8} justify={'end'} className="mt-0">
          {includes(actions, ActionsTypeEnum.CREATE) && (
            <CButtonAdd onClick={handleAdd} />
          )}
          <CButtonExport onClick={onDownload} loading={isLoadingExport} />
        </Flex>
      </RowHeader>
    </>
  );
};

export default Header;
