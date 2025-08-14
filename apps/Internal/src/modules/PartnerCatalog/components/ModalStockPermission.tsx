import { PlusOutlined } from '@ant-design/icons';

import { Button, Col, Form, Row } from 'antd';
import { Key, useEffect, useMemo, useState } from 'react';
import { getColumnsStockPermission } from '../constants';
import {
  useCreateStockPermission,
  useGetStockNumber,
  useGetStockPermission,
} from '../queryHooks';
import usePartnerStore from '../stores';
import {
  AnyElement,
  CButton,
  CInput,
  CModal,
  CTable,
  Show,
} from '@vissoft-react/common';
import { RotateCcw, Search } from 'lucide-react';

const ModalStockPermission = () => {
  const {
    openStockPermission,
    setOpenStockPermission,
    setPartnerTarget,
    partnerTarget,
  } = usePartnerStore();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedKeys, setSelectedKey] = useState<Key[]>([]);
  const [searchString, setSearchString] = useState<string>('');

  const [form] = Form.useForm();
  const handleClose = () => {
    setOpenStockPermission(false);
    form.resetFields();
    setSearchString('');
    setPartnerTarget(undefined);
    setIsEdit(false);
    setSelectedKey([]);
  };
  const { data: stockNumber, isLoading: loadingStockNumber } =
    useGetStockNumber(
      {
        stockType: [3],
      },
      openStockPermission
    );

  const { data: stockPermission, isLoading: loadingStockPermission } =
    useGetStockPermission(openStockPermission, partnerTarget?.id as number);

  useEffect(() => {
    if (stockPermission && stockPermission.length > 0) {
      setSelectedKey(stockPermission.map((item: AnyElement) => item.id));
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [stockPermission]);

  const {
    mutate: createStockPermission,
    isPending: loadingCreateStockPermission,
  } = useCreateStockPermission(() => {
    setIsEdit(false);
  });

  const columns = useMemo(() => {
    return getColumnsStockPermission();
  }, []);

  const dataTable = useMemo(() => {
    if (isEdit && stockNumber) {
      return stockNumber.content.filter((item: AnyElement) => {
        return (
          item.stockCode.toLowerCase().includes(searchString.toLowerCase()) ||
          item.stockName.toLowerCase().includes(searchString.toLowerCase())
        );
      });
    } else if (stockPermission) {
      return stockPermission;
    }
    return [];
  }, [stockNumber, isEdit, stockPermission, searchString]);

  const handleUpdateStockPermission = () => {
    createStockPermission({
      data: { stockIds: selectedKeys },
      id: partnerTarget?.id as string,
    });
  };

  const handleRefresh = () => {
    form.resetFields();
    setSearchString('');
  };

  const handleSubmitSearch = (values: { filter: string }) => {
    setSearchString(values.filter);
  };

  return (
    <CModal
      title={'Phân quyền kho số'}
      open={openStockPermission}
      width={1000}
      onCancel={handleClose}
      footer={null}
    >
      <div className="flex flex-col gap-3">
        <Show>
          <Show.When isTrue={isEdit}>
            <Form form={form} onFinish={handleSubmitSearch}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item name={'filter'}>
                    <CInput
                      placeholder={'Tìm kiếm theo mã hoặc tên kho'}
                      prefix={<Search size={16} />}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <div className="flex items-center gap-3">
                    <CButton icon={<Search size={16} />} htmlType="submit">
                      Tìm kiếm
                    </CButton>
                    <RotateCcw
                      size={16}
                      className="cursor-pointer self-center"
                      onClick={handleRefresh}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </Show.When>
        </Show>
        <CTable
          columns={columns}
          loading={
            loadingStockNumber ||
            loadingStockPermission ||
            loadingCreateStockPermission
          }
          rowKey={'id'}
          pagination={false}
          dataSource={dataTable}
          scroll={{ y: 500 }}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange(selectedRowKeys) {
              setSelectedKey(selectedRowKeys);
            },
            preserveSelectedRowKeys: true,
            getCheckboxProps: () => {
              return {
                disabled: !isEdit,
              };
            },
          }}
        />
      </div>
      <div className="flex justify-end mt-7 gap-4">
        <Show>
          <Show.When isTrue={isEdit}>
            <CButton
              icon={<PlusOutlined />}
              className={'w-[130px]'}
              onClick={handleUpdateStockPermission}
            >
              Lưu
            </CButton>
          </Show.When>
          <Show.Else>
            <CButton
              onClick={() => {
                setIsEdit(true);
              }}
              className={'w-[130px]'}
              disabled={isEdit}
            >
              Chỉnh sửa
            </CButton>
          </Show.Else>
        </Show>
        <Button className={'w-[130px]'} onClick={handleClose}>
          Đóng
        </Button>
      </div>
    </CModal>
  );
};

export default ModalStockPermission;
