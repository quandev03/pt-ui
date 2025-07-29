import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker, CTooltip } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { filterFalsy } from '@react/utils/index';
import { Col, Form, Row } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const allParams = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { time } = Form.useWatch((e) => e, form) ?? {};

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
    });
  }, [JSON.stringify(params)]);
  const handleSearch = (values: any) => {
    const { time, ...restValues } = values;
    setSearchParams(
      filterFalsy({
        ...params,
        ...restValues,
        fromDate: time ? dayjs(time[0]).startOf('d').format() : undefined,
        toDate: time ? dayjs(time[1]).endOf('d').format() : undefined,
        page: 0,
        queryTime: dayjs().format(DateFormat.TIME),
      })
    );
  };

  const items: ItemFilter[] = [
    {
      key: 'Ngày lập',
      label: 'Ngày lập',
      showDefault: true,
      value: (
        <Form.Item name="time" label="">
          <CRangePicker allowClear={false} className="!w-[268px]" />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái phiếu',
      value: (
        <Form.Item label="" name="deliveryNoteStatus" className="w-[180px]">
          <CSelect
            options={allParams?.DELIVERY_NOTE_STATUS ?? []}
            placeholder="Trạng thái phiếu"
          />
        </Form.Item>
      ),
    },
  ];
  const handleAdd = () => {
    navigate(pathRoutes.merchantEximAddIm);
  };
  const handleRefresh = () => {
    form.resetFields();
    setSearchParams({ queryTime: dayjs().format(DateFormat.TIME) });
  };
  return (
    <>
      <TitleHeader>Danh sách phiếu nhập kho từ NCC</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <CFilter
                items={items}
                searchComponent={
                  <CTooltip
                    title="Nhập mã phiếu hoặc mã đơn hàng"
                    placement="right"
                  >
                    <Form.Item label="" name="q">
                      <CInput
                        placeholder="Nhập mã phiếu hoặc mã đơn hàng"
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
        <CButtonAdd onClick={handleAdd} />
      </RowHeader>
    </>
  );
};

export default Header;
