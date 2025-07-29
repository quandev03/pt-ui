import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { MESSAGE } from '@react/utils/message';
import { Form, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SubscriberType } from '../../Subscriber/types';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { ImpactType } from 'apps/Internal/src/modules/SearchSubscription/types';

const Header = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: impactTypeData } = useGetApplicationConfig('SUB_ACTION');
  const { handleSearch } = useSearchHandler(
    'GET_LIST_BLOCK_OPEN_SUBSCRIBER_HISTORY'
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
        textSearch: values.textSearch,
        actionCode: values.actionCode,
        subType: values.subType,
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

  const handleRefresh = () => {
    form.resetFields();
    setSearchParams(
      {
        tab: 'blockOpenSubHistory',
        filters: '0,2',
        queryTime: dayjs().format(DateFormat.TIME),
      },
      { replace: true }
    );
  };

  const items: ItemFilter[] = [
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
                  ImpactType.OPEN_1_WAY,
                  ImpactType.OPEN_2_WAY,
                  ImpactType.BLOCK_1_WAY,
                  ImpactType.BLOCK_2_WAY,
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
    {
      label: 'Loại thuê bao',
      value: (
        <Form.Item name="subType" className="w-40">
          <CSelect
            placeholder="Loại thuê bao"
            showSearch={false}
            options={[
              { value: SubscriberType.M2M },
              { value: SubscriberType.H2H },
            ]}
          />
        </Form.Item>
      ),
    },
    {
      showDefault: true,
      label: 'Ngày thực hiện',
      value: (
        <>
          <Form.Item>
            <CSelect
              placeholder="Ngày thực hiện"
              showSearch={false}
              allowClear={false}
              defaultValue={1}
              options={[{ label: 'Ngày thực hiện', value: 1 }]}
            />
          </Form.Item>
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
        </>
      ),
    },
  ];

  return (
    <RowHeader>
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{
          typeDate: 1,
          rangePicker: [dayjs().subtract(29, 'd'), dayjs()],
        }}
      >
        <CFilter
          items={items}
          onRefresh={handleRefresh}
          searchComponent={
            <Tooltip
              title="Nhập Số thuê bao/ Người, Thiết bị SD/ User thực hiện/ Lý do"
              placement="topLeft"
            >
              <Form.Item name="textSearch" className="w-52">
                <CInput placeholder="Nhập điều kiện tìm kiếm" maxLength={100} />
              </Form.Item>
            </Tooltip>
          }
        />
      </Form>
    </RowHeader>
  );
};

export default Header;
