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
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageDateType } from '../types';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const HeaderPackageCapacity: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_PACKAGE_CAPACITY
  );

  useEffect(() => {
    if (params) {
      form.setFieldsValue({
        ...params,
        typeDate: params.typeDate ?? PackageDateType.START,
        rangePicker: [
          params.fromDate
            ? dayjs(params.fromDate, DateFormat.DEFAULT)
            : dayjs().subtract(6, 'M'),
          params.toDate ? dayjs(params.toDate, DateFormat.DEFAULT) : dayjs(),
        ],
      });
    }
  }, [params]);

  const handleFinish = (values: any) => {
    handleSearch(
      {
        ...params,
        packCode: values.packCode,
        typeDate: values.typeDate,
        fromDate: values.rangePicker
          ? dayjs(values.rangePicker[0]).format(DateFormat.DEFAULT)
          : dayjs().subtract(6, 'M').format(DateFormat.DEFAULT),
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
          <Form.Item name="typeDate" className="w-40">
            <CSelect
              placeholder="Loại ngày"
              showSearch={false}
              allowClear={false}
              options={[
                {
                  label: 'Ngày bắt đầu',
                  value: PackageDateType.START,
                },
                {
                  label: 'Ngày kết thúc',
                  value: PackageDateType.END,
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="rangePicker"
            className="w-72"
            rules={[
              {
                validator: (_, value) => {
                  if (value) {
                    const toDate = dayjs(value[1]).subtract(6, 'M');
                    if (toDate.isAfter(value[0], 'D')) {
                      return Promise.reject(
                        'Thời gian tìm kiếm không được vượt quá 6 tháng'
                      );
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
      <TitleHeader>Tra cứu thông tin gói cước</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          onFinish={handleFinish}
          initialValues={{
            typeDate: PackageDateType.START,
            rangePicker: [dayjs().subtract(6, 'M'), dayjs()],
          }}
        >
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.GET_LIST_PACKAGE_CAPACITY}
            searchComponent={
              <Form.Item name="packCode">
                <CInput
                  placeholder="Nhập mã/ tên gói cước"
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                  maxLength={100}
                  className="w-60"
                />
              </Form.Item>
            }
          />
        </Form>
      </RowHeader>
    </>
  );
};

export default HeaderPackageCapacity;
