import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CRangePicker } from '@react/commons/index';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import {
  ActionsTypeEnum,
  DateFormat,
  SearchTimeMax,
} from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import { getDate } from '@react/utils/datetime';
import { filterFalsy } from '@react/utils/index';
import { Col, Form, Row } from 'antd';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const actions = useRolesByRouter();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { time } = Form.useWatch((e) => e, form) ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!time)
      form.setFieldValue('time', [
        dayjs().subtract(SearchTimeMax, 'M'),
        dayjs(),
      ]);
  }, [time]);

  useEffect(() => {
    const { startDate, endDate, ...restParams } = params;
    form.setFieldsValue({
      ...restParams,
      time:
        startDate && startDate
          ? [dayjs(startDate), dayjs(endDate)]
          : [dayjs().subtract(SearchTimeMax, 'M'), dayjs()],
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
      startDate: time ? getDate(time[0], DateFormat.DATE_ISO) : undefined,
      endDate: time ? getDate(time[1], DateFormat.DATE_ISO) : undefined,
      page: 0,
      queryTime: dayjs().format(DateFormat.TIME),
    });
  };
  const handleAdd = () => {
    navigate(pathRoutes.kitUncraftAdd);
  };

  const items: ItemFilter[] = [
    {
      key: 'Thời gian',
      label: 'Thời gian',
      showDefault: true,
      value: (
        <Form.Item name="time" label="">
          <CRangePicker className="!w-[268px]" />
        </Form.Item>
      ),
    },
  ];
  return (
    <>
      <TitleHeader>Hủy ghép KIT</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={8}>
            <Col>
              <CFilter items={items} />
            </Col>
          </Row>
        </Form>
        {includes(actions, ActionsTypeEnum.CREATE) && (
          <CButtonAdd onClick={handleAdd} />
        )}
      </RowHeader>
    </>
  );
};

export default Header;
