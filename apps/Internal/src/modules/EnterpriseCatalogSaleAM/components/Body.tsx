import { Tooltip, Form, Row, Col } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ContentItem } from '../types';
import CTable from '@react/commons/Table';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import {
  BtnGroupFooter,
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { CButtonDelete } from '@react/commons/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useList } from '../queryHook/useList';
import { useDeleteFn } from '../queryHook/useDelete';
import CSelect from '@react/commons/Select';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { decodeSearchParams } from '@react/helpers/utils';
import CInput from '@react/commons/Input';
import CButton from '@react/commons/Button';
import { replaceAM, replaceChildren } from '../queryHook/useList';
const Body = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { isFetching: loadingTable, data: dataTable } = useList(params);
  const [preData, setPreData] = useState(dataTable?.content);
  const intl = useIntl();
  const { mutate: deleteMutate } = useDeleteFn();
  const [form] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>(
    dataTable?.content?.map((item: any) => item.id)
  );
  useEffect(() => {
    if (params) {
      const { param, positionCode, ...rest } = params;
      form.setFieldsValue({
        ...rest,
        param: param,
        positionCode: positionCode,
      });
    }
  }, [params]);

  // useEffect(() => {
  //   console.log("PRE DATTTTTTTTTT ", preData);
  //   console.log("CONTENT NEW ", dataTable?.content);
  //   if (dataTable?.content !== preData) {
  //     const defaultExpandedKeys = dataTable.content.map((item: any) => item.id); // Automatically expand all rows
  //     setExpandedRowKeys(defaultExpandedKeys);
  //     setPreData(dataTable?.content)
  //   }
  // }, [dataTable]); // Re-run whenever `dataTable` changes

  const handleExpand = (expanded: boolean, record: ContentItem) => {
    if (expanded) {
      setExpandedRowKeys((prevKeys) => [...prevKeys, record.id]);
    } else {
      setExpandedRowKeys((prevKeys) =>
        prevKeys.filter((key) => key !== record.id)
      );
    }
  };

  const positionCodeOptions = [
    {
      label: 'Nhân viên kinh doanh',
      value: '0',
    },
    {
      label: 'Nhân viên AM',
      value: '1',
    },
  ];
  const items: ItemFilter[] = [
    {
      label: 'Vị trí công việc',
      value: (
        <Form.Item name={'positionCode'} className="w-48">
          <CSelect
            options={positionCodeOptions}
            placeholder="Vị trí công việc"
            // loading={loadingReasonType}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];

  const handleAddSale = () => {
    navigate(pathRoutes.catalogSaleAMAddSale);
  };
  const handleAddAM = () => {
    navigate(pathRoutes.catalogSaleAMAddAM);
  };

  const columns: TableProps<ContentItem>['columns'] = [
    {
      title: 'Username',
      dataIndex: 'username',
      width: 250,
      align: 'left',
      ellipsis: { showTitle: false },
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      width: 180,
      align: 'left',
      ellipsis: { showTitle: false },
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Vị trí công việc',
      dataIndex: 'positionCode',
      width: 150,
      align: 'left',
      ellipsis: { showTitle: false },
      render: (value, record) => {
        return (
          <Tooltip
            title={value === 0 ? 'Nhân viên kinh doanh' : 'Nhân viên AM'}
            placement="topLeft"
          >
            <Text>{value === 0 ? 'Nhân viên kinh doanh' : 'Nhân viên AM'}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      width: 150,
      align: 'left',
      ellipsis: { showTitle: false },
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
      align: 'left',
      ellipsis: { showTitle: false },
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.action' }),
      align: 'center',
      width: 150,
      fixed: 'right',
      ellipsis: { showTitle: false },
      render(_, record) {
        return (
          <WrapperActionTable>
            {/* {includes(actionByRole, ActionsTypeEnum.READ) && ( */}
            <CButtonDelete
              onClick={() => handleDeleteItem(record.id)}
            />
          </WrapperActionTable>
        );
      },
    },
  ];

  const handleDeleteItem = (id: string) => {
    if (id) {
      ModalConfirm({
        message: 'Bạn có chắc chắn muốn xóa bản ghi ra khỏi danh mục?',
        handleConfirm: () => {
          deleteMutate(id);
        },
      });
    }
  };

  const handleFinish = (values: any) => {
    console.log('LOG CHECK ', values);

    const { param, positionCode, ...rest } = values;
    const filters = params.filters ?? 0;
    setSearchParams({
      ...params,
      ...rest,
      param: param,
      positionCode: positionCode,
      filters,
    });
  };

  return (
    <div>
      <div>
        <TitleHeader>Danh mục NVKD/AM</TitleHeader>
        <RowHeader>
          <Form
            form={form}
            // initialValues={{ param: 'a', positionCode: 1 }}
            onFinish={handleFinish}
          >
            <Row gutter={8}>
              <Col>
                <CFilter
                  searchComponent={
                    <Tooltip title="Nhập Username/Họ và tên/SĐT/Email">
                      <Form.Item label="" name={'param'}>
                        <CInput
                          placeholder="Nhập Username/ Họ và tên/ SĐT/ Email"
                          prefix={<FontAwesomeIcon icon={faSearch} />}
                          maxLength={100}
                        />
                      </Form.Item>
                    </Tooltip>
                  }
                  items={items}
                />
              </Col>
              <BtnGroupFooter>
                <CButton
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleAddSale}
                >
                  <FormattedMessage id="Thêm mới NVKD" />
                </CButton>
                <CButton
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleAddAM}
                >
                  <FormattedMessage id="Thêm mới AM" />
                </CButton>
              </BtnGroupFooter>
            </Row>
          </Form>
        </RowHeader>
      </div>
      {!loadingTable && (
        <CTable
          rowKey="id"
          expandable={{
            // expandedRowKeys,
            // onExpand: handleExpand,
            defaultExpandAllRows: true,
          }}
          loading={loadingTable}
          columns={columns}
          dataSource={
            params.positionCode === '0'
              ? replaceAM(dataTable?.content)
              : replaceChildren(dataTable?.content)|| []
          }
          // pagination={{
          //   current: params.page + 1,
          //   pageSize: params.size,
          //   total: dataTable?.totalElements,
          // }}
        />
      )}
    </div>
  );
};

export default Body;
