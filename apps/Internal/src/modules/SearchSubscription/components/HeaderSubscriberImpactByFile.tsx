import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import { Form } from 'antd';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ImpactType } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { MESSAGE } from '@react/utils/message';

const HeaderSubscriberImpactByFile: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: impactTypeData } = useGetApplicationConfig('SUB_ACTION');
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_IMPACT_HISTORY
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
        searchText: values.searchText,
        actionType: values.actionType,
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
      label: 'Ngày thực hiện',
      value: (
        <Form.Item
          name="rangePicker"
          className="w-72"
          rules={[
            {
              validator: (_, value) => {
                if (value) {
                  const toDate = dayjs(value[1]).subtract(1, 'M');
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
      ),
    },
    {
      showDefault: true,
      label: 'Loại tác động',
      value: (
        <Form.Item name="actionType" className="w-44">
          <CSelect
            placeholder="Loại tác động"
            showSearch={false}
            options={impactTypeData
              ?.filter((item) =>
                [ImpactType.BLOCK_ACTION, ImpactType.OPEN_ACTION].includes(
                  item.code as ImpactType
                )
              )
              ?.map((item) => ({
                label: item.name,
                value: item.code,
              }))}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <TitleHeader>Báo cáo kết quả cấm/mở tác động theo file</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          onFinish={handleFinish}
          initialValues={{ rangePicker: [dayjs().subtract(29, 'd'), dayjs()] }}
        >
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.GET_LIST_SUBSCRIBER_IMPACT_BY_FILE}
            searchComponent={
              <Form.Item name="searchText">
                <CInput
                  placeholder="Nhập tên file/ user thực hiện/ lý do"
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                  maxLength={100}
                  className="w-72"
                />
              </Form.Item>
            }
          />
        </Form>
      </RowHeader>
    </>
  );
};

export default HeaderSubscriberImpactByFile;
