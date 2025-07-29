import { CButtonAdd } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Form, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetOrgExport } from '../hooks/useGetOrgExport';
import { useGetOrgImport } from '../hooks/useGetOrgImport';
import { queryKeyListOrg } from '../hooks/useListOrg';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const actions = useRolesByRouter();
  const { handleSearch } = useSearchHandler(queryKeyListOrg);
  const {data: dataWarehouseImport,isPending: isPendingWarehouseImport} = useGetOrgImport(true)
  const {
    data: dataWarehouseExport = [],
    isPending: isPendingWarehouseExport,
  } = useGetOrgExport(true);
  const stockExport = useWatch('orgId',form);
  const stockImport = useWatch('ieOrgId',form);
  const listWarehouseExport = useMemo(() => {
    if (!dataWarehouseExport) return [];
    return dataWarehouseExport
        .filter((e) => e.orgId !== Number(stockImport))
        .map((e) => ({
            label: e.orgName,
            value: String(e.orgId),
        }));
}, [dataWarehouseExport, stockImport]);

const listWarehouseImport = useMemo(() => {
    if(!dataWarehouseImport) return [];
    return dataWarehouseImport
        .filter((e) => e.id !== Number(stockExport))
        .map((e) => ({
            label: e.orgName,
            value: String(e.id),
        }));
}, [dataWarehouseImport, stockExport]);

  const handleSubmit = (values: any) => {
    setSearchParams({
      ...params,
      ...values,
      page:0,
      fromDate: dayjs(values.rangePicker?.[0]).format(DateFormat.DATE_ISO),
      toDate: dayjs(values.rangePicker?.[1]).format(DateFormat.DATE_ISO),
    });
    handleSearch(searchParams);
  };
 useEffect(() => {
    if (params) {
      const { fromDate, toDate, ...rest } = params;
      const from = fromDate ? dayjs(fromDate) : dayjs().subtract(29, 'day');
      const to = toDate ? dayjs(toDate) : dayjs();
      form.setFieldsValue({
        rangePicker: [from, to],
      });
    }
  }, [params]);
  useEffect(() => {
    if(params.orgId){
      form.setFieldValue('orgId', String(params.orgId))
    } 
    if(params.ieOrgId){
      form.setFieldValue('ieOrgId', String(params.ieOrgId))
    }
  },[params.orgId,params.ieOrgId])
  const handleAdd = () => {
    navigate(pathRoutes.addOrganizationTransfer);
  };

  const items: ItemFilter[] = [
    {
      label: 'Kho xuất',
      value: (
        <Form.Item label="" name="orgId" className="w-56">
          <CSelect
            placeholder="Chọn kho xuất"
            loading={isPendingWarehouseExport}
            options={listWarehouseExport}
            onChange={(value) => {
              form.setFieldValue('orgId', value);
            }}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kho nhận',
      value: (
        <Form.Item label="" name="ieOrgId" className="w-56">
          <CSelect
            loading={isPendingWarehouseImport}
            placeholder="Chọn kho nhận"
            options={listWarehouseImport ?? []}
            onChange={(value) => {
              form.setFieldValue('ieOrgId', value);
            }}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày xuất',
      value: (
        <Form.Item name="rangePicker">
          <CRangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            allowClear={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];

  return (
    <>
      <TitleHeader>Danh sách điều chuyển hàng</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={[8, 8]}>
            <Col>
              <CFilter items={items} />
            </Col>
          </Row>
        </Form>
        {includes(actions, ActionsTypeEnum.CREATE) && (
          <CButtonAdd onClick={handleAdd} />
        )}
      </RowHeader>
    </>
  );
};

export default Header;
