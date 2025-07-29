import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import Show from '@react/commons/Template/Show';
import {
  RowHeader,
  TitleHeader,
} from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { includes } from 'lodash';
import { ActionsTypeEnum } from '@react/constants/app';
import dayjs, { Dayjs } from 'dayjs';
import { formatDateBe } from '@react/constants/moment';
import { CRangePicker } from '@react/commons/DatePicker';

import { OPTION_NUMBER_PROCESS_TYPE } from 'apps/Internal/src/constants/constants';

const Header = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const listRoles = useRolesByRouter();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_CLASSIFY_SPECIAL_NUMBER
  );

  const items: ItemFilter[] = [
    {
      label: 'Thời gian',
      value: (
        <Form.Item name="time" >
          <CRangePicker allowClear={false} />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Kiểu gán số',
      value: (
        <Form.Item name="processType" labelCol={{ span: 8 }} className="w-40">
          <CSelect placeholder="Kiểu gán số" options={OPTION_NUMBER_PROCESS_TYPE} showSearch={false}/>
        </Form.Item>
      ),
    },
  ];

  const handleAdd = () => {
    navigate(pathRoutes.classifySpecialNumberAdd);
  };

  const handleSearchForm = useCallback(
    (values: Record<string, string | [Dayjs, Dayjs]>) => {
      handleSearch({
        ...params,
        processType: values.processType || '',
        from: values.time
          ? (values.time as [Dayjs, Dayjs])[0].format(formatDateBe)
          : '',
        to: values.time
          ? (values.time as [Dayjs, Dayjs])[1].endOf('day').format(formatDateBe)
          : '',
      });
    },
    [params]
  );

  useEffect(() => {
    if (params.processType) {
      form.setFieldValue('processType', Number(params.processType));
    }
    if (params.filters) {
      form.setFieldValue('time', [
        params.from ? dayjs(params.from, formatDateBe) : dayjs().subtract(29, 'day'),
        params.to ? dayjs(params.to, formatDateBe) : dayjs()
      ]);
    }
  }, [params]);

  return (
    <>
      <TitleHeader>Danh sách gán số đặc biệt</TitleHeader>
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
              items={items}
              validQuery={REACT_QUERY_KEYS.GET_LIST_CLASSIFY_SPECIAL_NUMBER}
            />
        </Form>
        <Show>
          <Show.When isTrue={includes(listRoles, ActionsTypeEnum.CREATE)}>
            <CButtonAdd onClick={handleAdd} />
          </Show.When>
        </Show>
      </RowHeader>
    </>
  );
};

export default Header;
