import { PlusOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader } from '@react/commons/Template/style';
import { ModelStatus } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Button, Form, Tooltip } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const FilterAction = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const { handleSearch } = useSearchHandler(REACT_QUERY_KEYS.GET_ALL_USERS);

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item label="" name="status" className="w-40">
          <CSelect
            options={[
              {
                label: <FormattedMessage id="common.active" />,
                value: ModelStatus.ACTIVE,
              },
              {
                label: <FormattedMessage id="common.inactive" />,
                value: ModelStatus.INACTIVE,
              },
            ]}
            showSearch={false}
            placeholder="Trạng thái"
          />
        </Form.Item>
      ),
    },
  ];

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.userManagerAdd);
  }, []);

  useEffect(() => {
    form.setFieldsValue(params);
  }, []);

  return (
    <RowHeader className="flex justify-between flex-wrap mb-4 gap-4">
      <Form form={form} onFinish={handleSearch}>
        <CFilter
          items={items}
          validQuery={REACT_QUERY_KEYS.GET_ALL_USERS}
          searchComponent={
            <Tooltip title="Nhập họ và tên hoặc email" placement="right">
              <Form.Item name="q" className="min-w-72">
                <CInput
                  maxLength={100}
                  placeholder="Nhập họ và tên hoặc email"
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                />
              </Form.Item>
            </Tooltip>
          }
        />
      </Form>
      <div>
        {includes(actionByRole, ActionsTypeEnum.CREATE) && (
          <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
            <FormattedMessage id="common.add" />
          </Button>
        )}
      </div>
    </RowHeader>
  );
};
