import {
  faMagnifyingGlass,
  faRotateLeft,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CTable from '@react/commons/Table';
import { TitleHeader } from '@react/commons/Template/style';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Button, Form, Tooltip } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetListPartnerCreditLimits } from '../hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { geColumnsTableList } from '../constants';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { IPartnerCreditLimitsList } from '../type';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { includes } from 'lodash';
import { ActionsTypeEnum } from '@react/constants/app';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';

const List = () => {
  const listRoles = useRolesByRouter();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: partnerCreditLimitsData, isLoading: loadingTable } =
    useGetListPartnerCreditLimits(queryParams(params));
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.PartnerCreditLimits
  );

  useEffect(() => {
    form.setFieldsValue({ ...params });
  }, []);

  const dataTable = useMemo(() => {
    if (partnerCreditLimitsData) {
      return partnerCreditLimitsData.content;
    }
    return [];
  }, [partnerCreditLimitsData]);

  const handleAction = useCallback(
    (action: ACTION_MODE_ENUM, record: IPartnerCreditLimitsList) => {
      switch (action) {
        case ACTION_MODE_ENUM.VIEW:
          return navigate(
            pathRoutes.partnerCreditLimitsView(String(record.id))
          );
        case ACTION_MODE_ENUM.EDIT:
          return navigate(
            pathRoutes.partnerCreditLimitsEdit(String(record.id))
          );
        case ACTION_MODE_ENUM.DebtDetail:
          navigate(pathRoutes.partnerCreditLimitsDebt(String(record.id)));
          return;
        default:
          break;
      }
    },
    [navigate]
  );
  const { PARTNER_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const columns = useMemo(() => {
    return geColumnsTableList(params, listRoles, PARTNER_TYPE, handleAction);
  }, [params, listRoles, handleAction]);

  const handleRefresh = () => {
    form.resetFields();
    form.submit();
  };
  const handleAdd = () => {
    navigate(pathRoutes.partnerCreditLimitsAdd);
  };

  const handleSearchForm = (values: Record<string, string>): void => {
    const valueSearch = values['value-search'] ?? '';
    handleSearch({ 'value-search': valueSearch });
  };

  return (
    <div>
      <TitleHeader>Danh sách hạn mức đối tác</TitleHeader>
      <div className="flex flex-wrap justify-between">
        <Form
          form={form}
          onFinish={handleSearchForm}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <div className="flex items-start justify-start gap-4">
            <Tooltip title="Tìm kiếm theo tên Đối tác" placement="right">
              <Form.Item label="" name="value-search" className="!mb-0">
                <CInput
                  placeholder="Tìm kiếm theo tên Đối tác"
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                  maxLength={100}
                  onBlur={() => {
                    const value: string =
                      form.getFieldValue('value-search') ?? '';
                    form.setFieldValue('value-search', value.trim());
                  }}
                />
              </Form.Item>
            </Tooltip>

            <CButton
              icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              htmlType="submit"
            >
              Tìm kiếm
            </CButton>
            <FontAwesomeIcon
              icon={faRotateLeft}
              size="lg"
              className="cursor-pointer self-center"
              onClick={handleRefresh}
              title="Làm mới"
            />
          </div>
        </Form>
        <div>
          {includes(listRoles, ActionsTypeEnum.CREATE) && (
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              <FormattedMessage id="common.add" />
            </Button>
          )}
        </div>
      </div>
      <div className="mt-8">
        <CTable
          columns={columns}
          dataSource={dataTable}
          loading={loadingTable}
          otherHeight={50}
          rowKey={'id'}
          pagination={{
            total: partnerCreditLimitsData?.totalElements,
          }}
        />
      </div>
    </div>
  );
};

export default List;
