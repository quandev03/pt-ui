import { PlusOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker, CSelect } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDateV2 } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Button, Flex, Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { Tooltip } from 'antd/lib';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useLayoutEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  optionDateTypePromotionRest,
  optionStatusPromotionRest,
} from '../contants';
import { PROMOTION_REST_QUERY_KEY } from '../hooks';
import { EDateType } from '../types';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    PROMOTION_REST_QUERY_KEY.GET_LIST_PROMOTION_REST
  );
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  const onFinish = (val: any) => {
    const { valueSearch, dateTime } = val;
    const data = {
      ...val,
      page: 0,
      dateType: val.dateType ?? undefined,
      valueSearch: valueSearch && valueSearch.trim(),
      status: val.status ?? undefined,
      fromDate:
        dateTime && dateTime[0]
          ? dayjs(dateTime[0]).startOf('day').format(formatDateV2)
          : undefined,
      toDate:
        dateTime && dateTime[1]
          ? dayjs(dateTime[1]).endOf('day').format(formatDateV2)
          : undefined,
    };
    delete data.dateTime;
    handleSearch(data);
  };

  const handleAdd = () => {
    navigate(pathRoutes.promotionRestAdd);
  };

  const items: ItemFilter[] = [
    {
      key: 'date-type',
      label: 'Loại ngày',
      value: (
        <>
          <Form.Item
            initialValue={EDateType.CREATE}
            label=""
            name="dateType"
            className="w-40"
          >
            <CSelect
              onKeyDown={(e) => e.preventDefault()}
              options={optionDateTypePromotionRest}
              placeholder="Chọn loại ngày"
              showSearch={false}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item
            name="dateTime"
            className={'!w-72'}
            initialValue={[dayjs().subtract(29, 'day'), dayjs()]}
            rules={[
              {
                validator: (_, value) => {
                  if (value && value[1].diff(value[0], 'day') > 30) {
                    return Promise.reject(
                      new Error(
                        'Thời gian tìm kiếm không được vượt quá 30 ngày'
                      )
                    );
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
      key: 'status',
      label: 'Trạng thái',
      value: (
        <Form.Item name="status" className={'!w-44'}>
          <CSelect
            onKeyDown={(e) => e.preventDefault()}
            options={optionStatusPromotionRest}
            placeholder="Trạng thái"
            showSearch={false}
          />
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    if (params) {
      const { fromDate, toDate, ...rest } = params;
      const from = dayjs(fromDate, formatDateV2);
      const to = dayjs(toDate, formatDateV2);
      form.setFieldsValue({
        ...rest,
        status:
          optionStatusPromotionRest?.find((item: any) => {
            return String(item.value) === String(params.status);
          })?.value ?? null,
        dateTime: fromDate && toDate ? [from, to] : undefined,
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (!params.filters && isFirstTime) {
      setSearchParams({
        ...params,
      });
      setIsFirstTime(false);
    }
  }, [params.filters, isFirstTime]);

  const handleRefresh = () => {
    form.setFieldsValue({
      dateType: EDateType.CREATE,
      valueSearch: '',
      status: undefined,
      dateTime: [dayjs().subtract(29, 'day'), dayjs()],
    });
    setSearchParams(
      {
        page: '0',
        size: '20',
        valueSearch: '',
      },
      {
        replace: true,
      }
    );
  };

  return (
    <>
      <TitleHeader>Danh mục chương trình khuyến mại</TitleHeader>
      <Flex justify="space-between" wrap="wrap" gap={8}>
        <Form
          form={form}
          onFinish={onFinish}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <CFilter
            items={items}
            validQuery={PROMOTION_REST_QUERY_KEY.GET_LIST_PROMOTION_REST}
            searchComponent={
              <Tooltip
                title="Nhập mã CTKM/ tên CTKM/ người tạo/ người cập nhật"
                placement="topLeft"
              >
                <Form.Item label="" name="valueSearch">
                  <CInput
                    maxLength={100}
                    placeholder="Nhập mã CTKM/ tên CTKM/ người tạo/ người cập nhật"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    onBlur={() => {
                      form.setFieldValue(
                        'valueSearch',
                        form.getFieldValue('valueSearch')?.trim()
                      );
                    }}
                  />
                </Form.Item>
              </Tooltip>
            }
            onRefresh={handleRefresh}
          />
        </Form>
        <div>
          {includes(actionByRole, ActionsTypeEnum.CREATE) && (
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              <FormattedMessage id="common.add" />
            </Button>
          )}
        </div>
      </Flex>
    </>
  );
};

export default Header;
