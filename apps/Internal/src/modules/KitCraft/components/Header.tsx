import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonExport } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker, CTooltip } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { DateFormat, KitProcessType } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDate } from '@react/utils/datetime';
import { filterFalsy } from '@react/utils/index';
import { MESSAGE } from '@react/utils/message';
import { Col, Flex, Form, Row } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useExportKit } from '../hooks/useExportKit';
import { queryKeyListKitCraft } from '../hooks/useListKit';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { processType } = Form.useWatch((e) => e, form) ?? {};
  const allParams = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { mutateAsync: mutateExport, isPending: isLoadingExport } =
    useExportKit();

  useEffect(() => {
    const { fromDate, toDate, ...restParams } = params;
    form.setFieldsValue({
      ...restParams,
      time:
        fromDate && fromDate
          ? [dayjs(fromDate), dayjs(toDate)]
          : [dayjs().subtract(29, 'day'), dayjs()],
    });
  }, [JSON.stringify(params)]);
  const handleSearch = (values: any) => {
    setSearchParams(handlePackValue(values));
  };

  const handlePackValue = (values: any) => {
    const { time, ...restValues } = values;
    return filterFalsy({
      ...params,
      ...restValues,
      fromDate: time ? getDate(time[0], DateFormat.DATE_ISO) : undefined,
      toDate: time ? getDate(time[1], DateFormat.DATE_ISO) : undefined,
      page: 0,
      queryTime: dayjs().format(DateFormat.TIME),
    });
  };
  const onDownload = () => {
    mutateExport(handlePackValue(form.getFieldsValue()) as any);
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
      label: 'Loại ghép KIT',
      value: (
        <Form.Item label="" name="processType" className="w-40">
          <CSelect
            options={allParams?.COMBINE_KIT_PROCESS_TYPE ?? []}
            placeholder="Loại ghép KIT"
          />
        </Form.Item>
      ),
    },
  ];
  return (
    <>
      <TitleHeader>Báo cáo ghép KIT</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={8}>
            <Col>
              <CFilter
                items={items}
                validQuery={queryKeyListKitCraft}
                searchComponent={
                  <CTooltip
                    title="Nhập mã đơn hàng hoặc số thuê bao"
                    placement="right"
                  >
                    <Form.Item label="" name="orderNo">
                      <CInput
                        placeholder="Nhập mã đơn hàng hoặc số thuê bao"
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
          <CButtonExport
            disabled={processType === String(KitProcessType.BATCH)}
            onClick={onDownload}
            loading={isLoadingExport}
          />
        </Flex>
      </RowHeader>
    </>
  );
};

export default Header;
