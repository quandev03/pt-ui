import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { TitleHeader } from '@react/commons/Template/style';
import { formatDateBe } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Tooltip } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useStore from '../store';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { setIdDetail } = useStore();
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_DISCOUNT_LIST
  );

  const optionDuration = [
    { label: 'Còn hạn', value: '1' },
    { label: 'Hết hạn', value: '0' },
  ];

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Thời hạn',
        value: (
          <Form.Item name="duration" className={'!w-40'}>
            <CSelect
              options={optionDuration}
              placeholder="Thời hạn"
              showSearch={false}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Từ ngày - Tới ngày',
        value: (
          <Form.Item name="dateRange" className={'!w-72'}>
            <CRangePicker />
          </Form.Item>
        ),
      },
    ];
  }, []);

  const handleAdd = () => {
    navigate(pathRoutes.discountAdd);
    setIdDetail('');
  };

  const onFinish = (val: Record<string, string | [Dayjs, Dayjs]>) => {
    const { dateRange, duration } = val;
    const data = {
      duration: (duration as string) ?? undefined,
      startDate:
        dateRange && dateRange[0]
          ? dayjs(dateRange[0]).startOf('day').format(formatDateBe)
          : undefined,
      endDate:
        dateRange && dateRange[1]
          ? dayjs(dateRange[1]).endOf('day').format(formatDateBe)
          : undefined,
      quickSearch: val.quickSearch,
    };
    handleSearch(data);
  };

  useEffect(() => {
    const { startDate, endDate } = params;
    form.setFieldsValue({
      ...params,
      dateRange: [
        startDate ? dayjs(startDate).startOf('day') : null,
        endDate ? dayjs(endDate).endOf('day') : null,
      ],
    });
  }, []);

  return (
    <>
      <TitleHeader>Danh mục chiết khấu</TitleHeader>
      <div className={'flex justify-between flex-wrap mb-4 gap-4'}>
        <Form form={form} onFinish={onFinish} className={'flex-1'}>
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.GET_LIST_DISCOUNT_LIST}
            searchComponent={
              <Tooltip title="Nhập mã hoặc tên CTCK" placement="right">
                <Form.Item name="quickSearch">
                  <CInput
                    placeholder="Nhập mã hoặc tên CTCK"
                    maxLength={100}
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        <CButtonAdd onClick={handleAdd} />
      </div>
    </>
  );
};

export default Header;
