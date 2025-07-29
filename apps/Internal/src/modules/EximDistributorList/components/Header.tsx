import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { RowHeader, Text, TitleHeader } from '@react/commons/Template/style';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Divider, Form, Popover, Tooltip } from 'antd';
import { ContentStyled } from 'apps/Internal/src/components/layouts/AuthLayout/styled';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { moveMethod } from '../constant';
import { decodeSearchParams } from '@react/helpers/utils';
import { useCallback, useEffect } from 'react';
import { CRangePicker } from '@react/commons/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { formatDateBe, formatDateISO } from '@react/constants/moment';

const Header = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_EXIM_DISTRIBUTOR
  );

  const items: ItemFilter[] = [
    {
      label: 'Loại giao dịch',
      value: (
        <Form.Item name="moveMethod" labelCol={{ span: 8 }}>
          <CSelect
            placeholder="Loại giao dịch"
            options={moveMethod}
            style={{ width: '150px' }}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày lập',
      value: (
        <Form.Item name="time">
          <CRangePicker allowClear={false} />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];

  useEffect(() => {
    if (params.moveMethod) {
      form.setFieldValue('moveMethod', Number(params.moveMethod));
    }
    if (params.q) {
      form.setFieldValue('orderNo', params.q);
    }
    if (params.filters) {
      form.setFieldValue('time', [
        params.fromDate
          ? dayjs(params.fromDate, formatDateBe)
          : dayjs().subtract(29, 'day'),
        params.toDate ? dayjs(params.toDate, formatDateBe) : dayjs(),
      ]);
    }
  }, [params]);

  const handleSearchForm = useCallback(
    (values: Record<string, string | [Dayjs, Dayjs]>) => {
      handleSearch({
        ...params,
        moveMethod: values.moveMethod || '',
        q: values.orderNo,
        fromDate: values.time
          ? (values.time as [Dayjs, Dayjs])[0].format(formatDateISO)
          : '',
        toDate: values.time
          ? (values.time as [Dayjs, Dayjs])[1]
              .endOf('day')
              .format(formatDateISO)
          : '',
      });
    },
    [params]
  );

  const handleAdd = () => {
    navigate(pathRoutes.eximDistributorTransactionAdd);
  };
  return (
    <>
      <TitleHeader>Danh sách xuất nhập kho</TitleHeader>
      <RowHeader>
        <Form
          name="wrap"
          labelCol={{ flex: '110px' }}
          labelAlign="left"
          labelWrap
          colon={false}
          form={form}
          onFinish={handleSearchForm}
        >
          <CFilter
            searchComponent={
              <Tooltip
                title="Nhập mã phiếu hoặc mã giao dịch"
                placement="right"
              >
                <Form.Item name="orderNo">
                  <CInput
                    maxLength={100}
                    placeholder="Nhập mã phiếu hoặc mã giao dịch"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    onBlur={(e) => {
                      const trimmedValue = e.target.value.trim();
                      form.setFieldValue('orderNo', trimmedValue);
                    }}
                  />
                </Form.Item>
              </Tooltip>
            }
            validQuery={REACT_QUERY_KEYS.GET_LIST_EXIM_DISTRIBUTOR}
            items={items}
          />
        </Form>
        <CButtonAdd onClick={handleAdd} />
      </RowHeader>
    </>
  );
};

export default Header;
