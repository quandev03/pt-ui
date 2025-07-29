import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import {
  BtnGroupFooter,
  RowHeader,
  TitleHeader,
} from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Form, Row, Tooltip } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const { handleSearch } = useSearchHandler(REACT_QUERY_KEYS.GET_SUPPLIER_LIST);
  useEffect(() => {
    params && form.setFieldsValue(params);
  }, [params]);
  useEffect(() => {
    if (params.status === '' || params.status === undefined) {
      form.setFieldValue('status', '');
    }
  }, [params]);
  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item label={''} name={'status'} className="w-40">
          <CSelect
            defaultValue={''}
            options={[
              { value: '', label: 'Tất cả' },
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
    navigate(pathRoutes.supplier_add);
  };
  return (
    <>
      <TitleHeader>Danh mục nhà cung cấp</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={8}>
            <Col>
              <CFilter
                items={items}
                searchComponent={
                  <Tooltip
                    title="Tìm kiếm theo mã hoặc tên nhà cung cấp"
                    placement="right"
                  >
                    <Form.Item
                      label=""
                      name="search-string"
                      className="w-[340px]"
                    >
                      <CInput
                        placeholder="Tìm kiếm theo mã hoặc tên nhà cung cấp"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                        maxLength={100}
                      />
                    </Form.Item>
                  </Tooltip>
                }
                validQuery={REACT_QUERY_KEYS.GET_SUPPLIER_LIST}
              />
            </Col>
            <BtnGroupFooter>
              {includes(actionByRole, ActionsTypeEnum.CREATE) && (
                <CButtonAdd
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleAdd}
                >
                  <FormattedMessage id="common.add" />
                </CButtonAdd>
              )}
            </BtnGroupFooter>
          </Row>
        </Form>
      </RowHeader>
    </>
  );
};
export default Header;
