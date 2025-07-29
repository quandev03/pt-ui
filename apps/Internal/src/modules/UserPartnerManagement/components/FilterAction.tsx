import { PlusOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader } from '@react/commons/Template/style';
import { ModelStatus } from '@react/commons/types';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Button, Form } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export const FilterAction = () => {
  const [form] = Form.useForm();
  const { orgCode } = useParams();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
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
                value: null,
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
            showSearch={false}
            allowClear={false}
          />
        </Form.Item>
      ),
    },
  ];

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.partnerCatalogUserAdd(orgCode));
  }, []);
  useEffect(() => {
    form.setFieldsValue(params);
    if (params.status) {
      form.setFieldValue('status', params.status);
    } else {
      form.setFieldValue('status', null);
    }
  }, []);
  return (
    <RowHeader className="flex justify-between flex-wrap mb-4 gap-4">
      <Form
        form={form}
        onFinish={handleSearch}
        initialValues={{ orgCode: orgCode, status: null }}
      >
        <CFilter
          items={items}
          searchComponent={
            <>
              <Form.Item name="q">
                <CInput
                  maxLength={50}
                  placeholder="Tìm kiếm theo tên hoặc mã user"
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                />
              </Form.Item>
              <Form.Item label="" name="orgCode" className="w-[160px]">
                <CInput disabled />
              </Form.Item>
            </>
          }
        />
      </Form>
      <div>
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
          <FormattedMessage id="common.add" />
        </Button>
      </div>
    </RowHeader>
  );
};
