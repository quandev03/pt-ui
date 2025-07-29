import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ModelStatus, ParamsOption } from '@react/commons/types';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { MESSAGE } from '@react/utils/message';
import { Col, Form, Row, Tooltip } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { queryKeyList } from '../hook/useList';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';

const Header = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(queryKeyList);
  const {
    PROMOTION_PROGRAM_PROGRAM_SERVICE = [],
    PROMOTION_PROGRAM_PROMOTION_TYPE = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const optionStatus = [
    {
      label: 'Hoạt động',
      value: ModelStatus.ACTIVE,
    },
    {
      label: 'Không hoạt động',
      value: ModelStatus.INACTIVE,
    },
  ];
  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item className="min-w-40" name="status">
          <CSelect
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            options={optionStatus}
            showSearch={false}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Dịch vụ',
      value: (
        <Form.Item className="min-w-[160px]" name={'programService'}>
          <CSelect
            placeholder="Chọn dịch vụ"
            options={PROMOTION_PROGRAM_PROGRAM_SERVICE}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Khuyến mại theo',
      value: (
        <Form.Item className="min-w-[160px]" name={'promotionType'}>
          <CSelect
            placeholder="Chọn khuyến mại theo"
            options={PROMOTION_PROGRAM_PROMOTION_TYPE}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Loại ngày',
      value: (
        <>
          <Form.Item className="min-w-[160px]" name={'dateType'}>
            <CSelect
              placeholder="Loại ngày"
              options={[
                { label: 'Ngày tạo', value: 'createdDate' },
                { label: 'Ngày cập nhật', value: 'modifiedDate' },
              ]}
              allowClear={false}
              showSearch={false}
            />
          </Form.Item>
          <Form.Item
            name={'rangePicker'}
            rules={[
              {
                validator: (_, value) => {
                  if (value) {
                    const fromDate = dayjs(value[0]);
                    const toDate = dayjs(value[1]);
                    if (toDate.diff(fromDate, 'day') > 30) {
                      return Promise.reject(MESSAGE.G12);
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CRangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              allowClear={false}
            />
          </Form.Item>
        </>
      ),
      showDefault: true,
    },
  ];
  const handleSubmit = (values: any) => {
    const { rangePicker } = values;
    if (rangePicker) {
      const fromDate = rangePicker[0];
      const toDate = rangePicker[1];
      if (toDate.diff(fromDate, 'day') > 30) {
        return;
      }
      handleSearch({
        ...params,
        ...values,
        fromDate: values.rangePicker?.[0]?.format(formatDateEnglishV2),
        toDate: values.rangePicker?.[1]?.format(formatDateEnglishV2),
        programService: values.programService,
        promotionType: values.promotionType,
      });
    }
  };
  useEffect(() => {
    if (params) {
      const { fromDate, toDate, dateType, ...rest } = params;
      const from = fromDate
        ? dayjs(fromDate).startOf('day')
        : dayjs().subtract(29, 'day').startOf('day');
      const to = toDate ? dayjs(toDate).endOf('day') : dayjs().endOf('day');
      form.setFieldsValue({
        ...rest,
        dateType: dateType ? dateType : 'createdDate',
        rangePicker: [from, to],
        programService: rest.programService,
        promotionType: rest.promotionType,
      });
    }
  }, [params]);
  const handleAdd = useCallback(() => {
    navigate(pathRoutes.promotionProgramBusinessAdd);
  }, [navigate]);
  return (
    <div>
      <TitleHeader>Danh sách mã khuyến mại</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={8}>
            <Col>
              <CFilter
                searchComponent={
                  <Tooltip
                    title="Nhập tên/mã khuyến mại/sản phẩm trong CTKM"
                    placement="right"
                    overlayInnerStyle={{
                      width: '350px',
                    }}
                  >
                    <Form.Item name="q">
                      <CInput
                        maxLength={100}
                        placeholder="Nhập tên/mã khuyến mại/sản phẩm trong CTKM"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                      />
                    </Form.Item>
                  </Tooltip>
                }
                validQuery={queryKeyList}
                items={items}
              />
            </Col>
          </Row>
        </Form>
        <CButtonAdd onClick={handleAdd} />
      </RowHeader>
    </div>
  );
};
export default Header;
