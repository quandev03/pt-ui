import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import CSelect from '@react/commons/Select';
import { MESSAGE } from '@react/utils/message';

const HeaderSmsHistory: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_SMS_HISTORY
  );

  useEffect(() => {
    if (params) {
      form.setFieldsValue({
        ...params,
        rangePicker: [
          params.fromDate
            ? dayjs(params.fromDate, DateFormat.DEFAULT)
            : dayjs().subtract(29, 'd'),
          params.toDate ? dayjs(params.toDate, DateFormat.DEFAULT) : dayjs(),
        ],
      });
    }
  }, [params]);

  const handleFinish = (values: any) => {
    handleSearch(
      {
        ...params,
        fromDate: values.rangePicker
          ? dayjs(values.rangePicker[0]).format(DateFormat.DEFAULT)
          : dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
        toDate: values.rangePicker
          ? dayjs(values.rangePicker[1]).format(DateFormat.DEFAULT)
          : dayjs().format(DateFormat.DEFAULT),
      },
      { replace: true }
    );
  };

  const items: ItemFilter[] = [
    {
      showDefault: true,
      label: 'Loại ngày',
      value: (
        <>
          <Form.Item>
            <CSelect
              placeholder="Loại ngày"
              showSearch={false}
              allowClear={false}
              defaultValue={1}
              options={[{ label: 'Ngày gửi', value: 1 }]}
            />
          </Form.Item>
          <Form.Item
            name="rangePicker"
            className="w-72"
            rules={[
              {
                validator: (_, value) => {
                  if (value) {
                    const toDate = dayjs(value[1]).subtract(29, 'd');
                    if (toDate.isAfter(value[0], 'D')) {
                      return Promise.reject(MESSAGE.G12);
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CRangePicker allowClear={false} />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <>
      <TitleHeader>Lịch sử SMS</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          onFinish={handleFinish}
          initialValues={{ rangePicker: [dayjs().subtract(29, 'd'), dayjs()] }}
        >
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.GET_LIST_SMS_HISTORY}
          />
        </Form>
      </RowHeader>
    </>
  );
};

export default HeaderSmsHistory;
