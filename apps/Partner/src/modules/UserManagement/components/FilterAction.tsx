import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader } from '@react/commons/Template/style';
import { ModelStatus } from '@react/commons/types';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Form, Row } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

export const FilterAction = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(REACT_QUERY_KEYS.GET_ALL_USERS);

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item label="" name="status" className="w-40">
          <CSelect
            options={[
              {
                label: <FormattedMessage id="common.all" />,
                value: '',
              },
              {
                label: <FormattedMessage id="common.active" />,
                value: ModelStatus.ACTIVE,
              },
              {
                label: <FormattedMessage id="common.inactive" />,
                value: ModelStatus.INACTIVE,
              },
            ]}
            placeholder="Trạng thái"
          />
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    form.setFieldsValue(params);
  }, []);

  return (
    <RowHeader className="flex justify-between flex-wrap mb-5 gap-4">
      <Form form={form} onFinish={handleSearch}>
        <Row gutter={8}>
          <Col span={5}>
            <Form.Item name="q" className="min-w-72">
              <CInput
                maxLength={100}
                placeholder="Nhập họ và tên hoặc email"
                prefix={<FontAwesomeIcon icon={faSearch} />}
              />
            </Form.Item>
          </Col>
          <Col>
            <CFilter
              items={items}
              validQuery={REACT_QUERY_KEYS.GET_ALL_USERS}
            />
          </Col>
        </Row>
      </Form>
    </RowHeader>
  );
};
