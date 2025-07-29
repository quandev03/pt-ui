import { PlusOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CSelect } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { filterFalsy } from '@react/utils/index';
import { Button, Form, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DELIVERY_PROGRAM_PROMOTION_QUERY_KEY } from '../hooks';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const handleSearch = (values: any) => {
    setSearchParams(
      filterFalsy({
        ...params,
        ...values,
        programName: values?.programName?.trim(),
        page: 0,
        channel: values?.channel ? values?.channel?.join(',') : undefined,
      })
    );
  };

  const handleAdd = () => {
    navigate(pathRoutes.deliveryPromotionscategoryAdd);
  };

  const { DELIVERY_PROGRAM_PROMOTION_CHANNEL = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const items: ItemFilter[] = [
    {
      key: 'Kênh',
      label: 'Chọn kênh áp dụng',
      value: (
        <Form.Item label="" name="channel" className="w-60">
          <CSelect
            options={DELIVERY_PROGRAM_PROMOTION_CHANNEL}
            placeholder="Chọn kênh áp dụng"
            mode="multiple"
          />
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    form.setFieldsValue({ ...params, channel: params?.channel?.split(',') });
  }, []);

  return (
    <>
      <TitleHeader>Danh mục CTKM vận chuyển</TitleHeader>
      <div className="flex flex-wrap justify-between">
        <Form
          form={form}
          onFinish={handleSearch}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <CFilter
            items={items}
            validQuery={DELIVERY_PROGRAM_PROMOTION_QUERY_KEY.LIST}
            searchComponent={
              <Tooltip title="Nhập tên CTKM để tìm kiếm" placement="right">
                <Form.Item label="" name="programName">
                  <CInput
                    maxLength={100}
                    placeholder="Nhập tên CTKM"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    onBlur={() => {
                      form.setFieldValue(
                        'programName',
                        form.getFieldValue('programName')?.trim()
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
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              <FormattedMessage id="common.add" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
