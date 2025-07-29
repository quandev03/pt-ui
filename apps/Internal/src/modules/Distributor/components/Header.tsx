import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input/index';
import CSelect from '@react/commons/Select';
import {
  BtnGroupFooter,
  RowHeader,
  TitleHeader,
} from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import { Col, Form, Row } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    params && form.setFieldsValue(params);
  }, [params]);
  useEffect(() => {
    if (params.status === '' || params.status === undefined) {
      form.setFieldValue('status', '');
    }
  }, [params]);
  const handleAdd = () => {
    navigate(pathRoutes.distributorAdd);
  };

  const items: ItemFilter[] = [
    {
      label: 'Loại đối tác',
      value: (
        <Form.Item label={''} name={'partnerType'}>
          <CSelect options={[]} placeholder="Loại đối tác" />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái hoạt động',
      value: (
        <Form.Item label={''} name={'status'}>
          <CSelect
            options={[
              {
                label: 'Tất cả',
                value: '',
              },
              {
                label: 'Hoạt động',
                value: 1,
              },
              {
                label: 'Không hoạt động',
                value: 2,
              },
            ]}
            placeholder="Trạng thái hoạt động"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái phê duyệt',
      value: (
        <Form.Item label={''} name={'approvalStatus'}>
          <CSelect
            options={[
              {
                label: 'Tất cả',
                value: '',
              },
              {
                label: 'Chờ phê duyệt',
                value: 1,
              },
              {
                label: 'Đã phê duyệt',
                value: 3,
              },
              {
                label: 'Từ chối',
                value: 4,
              },
            ]}
            placeholder="Trạng thái phê duyệt"
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <div>
      <TitleHeader>Danh mục NPP/Kênh</TitleHeader>
      <RowHeader>
        <Form form={form} initialValues={{ status: '', approvalStatus: '' }}>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item label="" name={'searchString'}>
                <CInput
                  placeholder="Tìm kiếm theo mã hoặc tên đối tác"
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                  maxLength={100}
                />
              </Form.Item>
            </Col>
            <Col>
              <CFilter items={items} />
            </Col>
            <BtnGroupFooter>
              {/* {includes(actionByRole, ActionsTypeEnum.DELETE) && ( */}
              {/* <Button
            disabled={selectedRowKeys.length === 0}
            onClick={handleDeleteMuti}
          >
            <FormattedMessage id="common.delete" />
          </Button> */}
              {/* )} */}
              {/* {includes(actionByRole, ActionsTypeEnum.CREATE) && ( */}
              <CButtonAdd
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={handleAdd}
              >
                <FormattedMessage id="common.add" />
              </CButtonAdd>
              {/* )} */}
            </BtnGroupFooter>
          </Row>
        </Form>
      </RowHeader>
    </div>
  );
};

export default Header;
