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
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { COVERAGE_AREA_QUERY_KEYS } from '../queryHooks';

type FilterActionProps = {
  rangeTypeOptions: { label: string; value: string; id: number }[];
};
export const FilterAction = ({ rangeTypeOptions }: FilterActionProps) => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const { handleSearch } = useSearchHandler(
    COVERAGE_AREA_QUERY_KEYS.GET_ALL_COVERAGE_AREAS
  );

  const items: ItemFilter[] = [
    {
      label: 'Loại phạm vi',
      value: (
        <Form.Item label="" name="rangeType" className="w-40">
          <CSelect
            options={rangeTypeOptions}
            showSearch={false}
            placeholder="Loại phạm vi"
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Trạng thái',
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
    navigate(pathRoutes.coverageAreaManagerAdd);
  }, []);

  useEffect(() => {
    form.setFieldsValue(params);
  }, []);

  return (
    <RowHeader className="flex justify-between flex-wrap mb-4 gap-4">
      <Form form={form} onFinish={handleSearch}>
        <CFilter
          items={items}
          validQuery={COVERAGE_AREA_QUERY_KEYS.GET_ALL_COVERAGE_AREAS}
          searchComponent={
            <Tooltip title="Nhập tên quốc gia/ khu vực" placement="right">
              <Form.Item name="valueSearch" className="min-w-72">
                <CInput
                  maxLength={255}
                  placeholder="Nhập tên quốc gia/ khu vực"
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
