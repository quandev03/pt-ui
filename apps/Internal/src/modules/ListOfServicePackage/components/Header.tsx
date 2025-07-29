import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import {
  BtnGroupFooter,
  RowHeader,
  TitleHeader,
} from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { Col, Form, Row, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    params && form.setFieldsValue(params);
  }, [params]);

  const { PACKAGE_PROFILE_GROUP_TYPE = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const handleSearch = (values: AnyElement) => {
    setSearchParams({
      ...params,
      ...values,
      page: 0,
    });
  };
  const items: ItemFilter[] = [
    {
      label: 'Nhóm gói cước',
      value: (
        <Form.Item label={''} name={'group-type'} className="w-36">
          <CSelect
            options={PACKAGE_PROFILE_GROUP_TYPE}
            placeholder="Nhóm gói cước"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái',
      value: (
        <Form.Item label={''} name={'status'} className="w-40">
          <CSelect
            options={[
              { value: 1, label: 'Hoạt động' },
              { value: 0, label: 'Không hoạt động' },
            ]}
            placeholder="Trạng thái"
          />
        </Form.Item>
      ),
    },
  ];
  const handleAdd = () => {
    navigate(pathRoutes.list_of_service_package_add);
  };
  const actionByRole = useRolesByRouter();
  return (
    <>
      <TitleHeader>Danh mục gói cước</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={8}>
            <Col>
              <CFilter
                items={items}
                searchComponent={
                  <Tooltip
                    title="Tìm kiếm theo mã API hoặc tên gói cước"
                    placement="right"
                  >
                    <Form.Item label="" name="search-string">
                      <CInput
                        placeholder="Tìm kiếm theo mã API hoặc tên gói cước"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                        maxLength={100}
                      />
                    </Form.Item>
                  </Tooltip>
                }
              />
            </Col>
            <BtnGroupFooter>
              {includes(actionByRole, ActionsTypeEnum.CREATE) && (
                <CButton
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleAdd}
                >
                  <FormattedMessage id="common.add" />
                </CButton>
              )}
            </BtnGroupFooter>
          </Row>
        </Form>
      </RowHeader>
    </>
  );
};
export default Header;
