import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CSelect } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import { filterFalsy } from '@react/utils/index';
import { Col, Form, Row, Tooltip } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DELIVERY_FEE_CATEGORY_QUERY_KEY } from '../hooks';

type Props = {
  provinces: any[];
};

const Header: React.FC<Props> = ({ provinces }) => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  useEffect(() => {
    form.setFieldsValue(params);
  }, [params]);

  const handleSearch = (values: any) => {
    setSearchParams(
      filterFalsy({
        ...params,
        ...values,
        page: 0,
      })
    );
  };

  const handleAdd = () => {
    navigate(pathRoutes.deliveryFeecategoryAdd);
  };

  const items: ItemFilter[] = [
    {
      key: 'fromProvince',
      label: 'Điểm đi',
      value: (
        <Form.Item label="" name="fromProvince" className="w-60">
          <CSelect placeholder="Chọn điểm đi" options={provinces} />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <TitleHeader>Danh mục phí vận chuyển</TitleHeader>
      <div className="flex flex-wrap justify-between">
        <Form form={form} onFinish={handleSearch} className={'flex-1'}>
          <CFilter
            items={items}
            validQuery={DELIVERY_FEE_CATEGORY_QUERY_KEY.LIST}
            searchComponent={
              <Tooltip title="Nhập tên khu vực để tìm kiếm" placement="right">
                <Form.Item label="" name="locationName">
                  <CInput
                    maxLength={100}
                    placeholder="Nhập tên khu vực để tìm kiếm"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    onBlur={() => {
                      form.setFieldValue(
                        'locationName',
                        form.getFieldValue('locationName')?.trim()
                      );
                    }}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        <div>
          {includes(actionByRole, ActionsTypeEnum.CREATE) && (
            <CButtonAdd onClick={handleAdd} />
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
