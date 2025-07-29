import { CSelect, CTable } from '@react/commons/index';
import { FC, Key, useCallback, useMemo, useState } from 'react';
import '../index.scss';
import { ActionType } from '@react/constants/app';
import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { RowHeader, Text, WrapperButton } from '@react/commons/Template/style';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import { Col, Form, Row, Tooltip } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { ItemEdit } from '../../CategoryProfile/queryHook/useAdd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStaffList } from '../queryHook/useStaff';
import { ColumnsType } from 'antd/es/table';
import { ContentItem } from '../types';
import CustomSearch from '@react/commons/Search';
import { decodeSearchParams } from '@react/helpers/utils';
import { CReloadButton } from '@react/commons/ReloadButton';
import { useAddSale } from '../queryHook/useAdd';
import { useSaleList } from '../queryHook/useListSale';
import { NotificationWarning } from '@react/commons/Notification';
type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [textSearch, setTextSearch] = useState('');
  const { data: dataSales } = useSaleList();
  const { data: dataTable } = useStaffList(params);
  const { mutate: addSale } = useAddSale(form);

  const saleStaffOptions = dataSales?.map((item: any) => ({
    label: item.fullname + ' - ' + item.username,
    value: item.id,
  }));
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const onSelectChange = useCallback((newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);
  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
    }),
    [onSelectChange, selectedRowKeys]
  );

  const navigate = useNavigate();

  const handleCloseModal = () => {
    form.resetFields();
    navigate(pathRoutes.catalogSaleandAM);
  };

  const handleSearch = () => {
    setSearchParams({
      ...params,
      param: textSearch,
    });
  };

  const handleRefresh = useCallback(() => {
    setSearchParams({
      ...params,
      page: 0,
    });
    setTextSearch('');
  }, []);

  const handleFinishForm = (values: ItemEdit) => {
    return 0;
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const columns: ColumnsType<ContentItem> = [
    {
      title: 'STT',
      width: 50,
      align: 'left',
      render(_, record, index) {
        const stt = index + 1 + params.page * params.size;
        return <Text>{stt}</Text>;
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 150,
      align: 'left',
      render: (value, record) => {
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
      render(value, record) {
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
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];

  const handleAddAM = () => {
    if (!form.getFieldValue('parentId')) {
      form.setFields([
        {
          name: 'parentId',
          errors: ['Không được để trống trường này'],
        },
      ]);
      return;
    } else {
      form.setFields([
        {
          name: 'parentId',
          errors: [],
        },
      ]);
      if(selectedRowKeys.length === 0) {
        NotificationWarning('Vui lòng tích chọn ít nhất 1 user');
        return;
      }
      const amArr = [];
      for (let i = 0; i < selectedRowKeys.length; i++) {
        const matchItems = dataTable?.content?.filter(
          (item: ContentItem) => item.id === selectedRowKeys[i]
        );
        console.log('MATCH ITEMS: ', matchItems);

        amArr.push({
          userId: matchItems[0].id,
          positionCode: 1,
          username: matchItems[0].username,
          fullname: matchItems[0].fullname,
          phoneNumber: matchItems[0].phoneNumber,
          email: matchItems[0].email,
          parentId: form.getFieldValue('parentId'),
        });
      }
      console.log('check arrr ', amArr);
      addSale(amArr);
    }
  };

  return (
    <>
      <TitleHeader>{'Thêm AM'}</TitleHeader>
      <Form form={form} {...layout} onFinish={handleFinishForm}>
        <Row gutter={24}>
          <Col span={10}>
            <Form.Item label="Người quản lý" name="parentId" required>
              <CSelect
                placeholder="Chọn nhân viên kinh doanh"
                options={saleStaffOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <RowHeader>
          <WrapperButton>
            <CustomSearch
              tooltip={intl.formatMessage({
                id: 'Nhập Username/Họ và tên/Email',
              })}
              onSearch={handleSearch}
              value={textSearch}
              setValue={setTextSearch}
              maxLength={100}
            />
            <CReloadButton onClick={handleRefresh} />
          </WrapperButton>
        </RowHeader>
        <CTable
          rowKey="id"
          rowSelection={rowSelection}
          expandable={{ defaultExpandAllRows: true }}
          columns={columns}
          dataSource={dataTable?.content}
          pagination={{
            current: params.page + 1,
            pageSize: params.size,
            total: dataTable?.totalElements,
          }}
          subHeight={210}
          // onChange={handleChangeTable}
        />
        <RowButton>
          <Form.Item name="saveForm" initialValue={false}></Form.Item>
          <Form.Item name="id"></Form.Item>
          <CButtonSaveAndAdd onClick={handleAddAM}></CButtonSaveAndAdd>
          <CButtonSave
            onClick={() => {
              form.setFieldValue('saveForm', true)
              handleAddAM();
            }}
          >
            <FormattedMessage id="common.save" />
          </CButtonSave>
          <CButtonClose onClick={handleCloseModal}>Đóng</CButtonClose>
        </RowButton>
      </Form>
    </>
  );
};

export default ModalAddEditView;
