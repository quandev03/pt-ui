import { Tooltip, Form, Row, Col } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ContentItem } from '../types';
import CTable from '@react/commons/Table';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import {
  BtnGroupFooter,
  RowHeader,
  Text,
  TitleHeader,
} from '@react/commons/Template/style';
import { useSearchParams } from 'react-router-dom';
import CSelect from '@react/commons/Select';
import { decodeSearchParams } from '@react/helpers/utils';
import { CButtonExport } from '@react/commons/Button';
import { useArea } from '../../ListOfDepartment/queryHook/useArea';
import { useList } from '../queryHook/useList';
import { useExportList } from '../queryHook/useExport';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';

const Body = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const intl = useIntl();
  const [form] = Form.useForm();
  const provinceCode = Form.useWatch('provinceId', form);
  const { mutate: mutateExport } = useExportList();
  const {
    isPending: loadingProvinces,
    data: optionsProvinces,
    mutate: getMutateProvinces,
  } = useArea();
  const {
    isPending: loadingDistrict,
    data: optionsDistrict,
    mutate: getMutateDistrict,
  } = useArea();

  const { data: dataTable } = useList({ ...params });

  const provinceOptions = optionsProvinces?.map((item: any) => ({
    label: item.areaName,
    value: parseInt(item.id),
  }));
  const districtOptions = optionsDistrict?.map((item: any) => ({
    label: item.areaName,
    value: parseInt(item.id),
  }));

  useEffect(() => {
    if (params) {
      const { provinceId, districtId, ...rest } = params;
      const province = provinceId ? parseInt(provinceId) : undefined;
      const district = districtId ? parseInt(districtId) : undefined;
      console.log('PARAMSS ');
      form.setFieldsValue({
        ...rest,
        provinceId: province,
        districtId: district,
      });
    }
  }, [params.districtId, params.provinceId]);

  useEffect(() => {
    if (params.filters) {
      getMutateProvinces('');
      form.submit();
    }
  }, [params.filters]);

  useEffect(() => {
    if (provinceCode) {
      getMutateDistrict(provinceCode);
    }
  }, [provinceCode]);

  const items: ItemFilter[] = [
    {
      label: 'Tỉnh/Thành phố',
      value: (
        <Form.Item label={''} name={'provinceId'} className="w-48">
          <CSelect
            options={provinceOptions}
            placeholder="Tỉnh/Thành phố"
            loading={loadingProvinces}
            allowClear={false}
            onChange={(value) => {
              form.setFieldValue('districtId', null);
            }}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Quận/Huyện',
      value: (
        <Form.Item label={''} name={'districtId'} className="w-52">
          <CSelect
            options={districtOptions}
            placeholder="Quận/Huyện"
            loading={loadingDistrict}
            allowClear={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];

  const defaultFilter = items
    .map((item, index) => (item.showDefault ? index : -1))
    .filter((index) => index !== -1)
    .join(',');
  const defaultParam = { filters: defaultFilter };

  const handleExport = () => {
    mutateExport(params);
  };

  const columns: ColumnsType<ContentItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: intl.formatMessage({ id: 'Phường/Xã' }),
      dataIndex: 'areaName',
      width: 150,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'Mã' }),
      dataIndex: 'areaCode',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];

  const handleFinish = (values: any) => {
    const { provinceId, districtId, ...rest } = values;
    setSearchParams({
      ...params,
      ...rest,
      isCall: true,
      provinceId: provinceId ? parseInt(provinceId) : undefined,
      districtId: districtId ? parseInt(districtId) : undefined,
    });
  };

  const handleRefresh = () => {
    form.resetFields();
    setSearchParams(
      {
        ...defaultParam,
        isCall: true,
        queryTime: dayjs().format(DateFormat.TIME),
      },
      {
        replace: true,
      }
    );
  };

  return (
    <div>
      <div>
        <TitleHeader>Danh mục địa bàn</TitleHeader>
        <RowHeader>
          <Form
            form={form}
            // initialValues={{ provinceId: 1, districtId: 69 }}
            onFinish={handleFinish}
          >
            <Row gutter={8}>
              <Col>
                <CFilter items={items} onRefresh={handleRefresh} />
              </Col>
              <BtnGroupFooter>
                <CButtonExport onClick={handleExport}>
                  <FormattedMessage id="common.add" />
                </CButtonExport>
              </BtnGroupFooter>
            </Row>
          </Form>
        </RowHeader>
      </div>
      <CTable
        rowKey="id"
        // expandable={{ defaultExpandAllRows: true }}
        columns={columns}
        dataSource={dataTable?.content}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: dataTable?.totalElements,
        }}
        // onChange={handleChangeTable}
      />
    </div>
  );
};

export default Body;
