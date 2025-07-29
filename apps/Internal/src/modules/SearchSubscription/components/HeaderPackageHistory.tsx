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
import { PackageDateType, ImpactType } from '../types';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useSearchHandler from '@react/hooks/useSearchHandler';

const HeaderPackageHistory: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: impactTypeData } = useGetApplicationConfig('SUB_ACTION');
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_PACKAGE_HISTORY
  );

  useEffect(() => {
    if (params) {
      form.setFieldsValue({
        ...params,
        typeDate: params.typeDate ?? PackageDateType.IMPLEMENT,
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
        userName: values.userName,
        actionCode: values.actionCode,
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
                  label: 'Ngày thực hiện',
                  value: PackageDateType.IMPLEMENT,
                },
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
    {
      showDefault: true,
      label: 'Loại tác động',
      value: (
        <Form.Item name="actionCode" className="w-40">
          <CSelect
            placeholder="Loại tác động"
            showSearch={false}
            options={impactTypeData
              ?.filter((item) =>
                [
                  ImpactType.REGISTER_PACKAGE,
                  ImpactType.CANCEL_PACKAGE,
                ].includes(item.code as ImpactType)
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
      <TitleHeader>Lịch sử đăng ký gói cước</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          onFinish={handleFinish}
          initialValues={{
            typeDate: PackageDateType.IMPLEMENT,
            rangePicker: [dayjs().subtract(6, 'M'), dayjs()],
          }}
        >
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.GET_LIST_PACKAGE_HISTORY}
            searchComponent={
              <Form.Item name="userName">
                <CInput
                  placeholder="User thực hiện"
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

export default HeaderPackageHistory;
