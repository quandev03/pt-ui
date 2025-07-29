import CButton, { CButtonClose, CButtonSave } from '@react/commons/Button';
import { CTable } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CModal from '@react/commons/Modal';
import { CReloadButton } from '@react/commons/ReloadButton';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { getColumnsTableNation } from '../constants';
import { useGetNations } from '../queryHooks';
import useCoverageManagementStore from '../store';
import { ICountry, INationItem } from '../types';

type ChooseNationMadalProps = {
  open: boolean;
  setIsOpen: (value: boolean) => void;
};
const ChooseNationMadal = ({ open, setIsOpen }: ChooseNationMadalProps) => {
  const [params, setParams] = useState({
    page: 0,
    size: 20,
    valueSearch: '',
  });
  const { formNations } = useCoverageManagementStore();
  const columns = getColumnsTableNation(params);
  const { data, isFetching, refetch } = useGetNations(params);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [nationList, setNationList] = useState<INationItem[]>([]);
  const [form] = Form.useForm();
  const rowSelection = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: (record: INationItem) => ({
      disabled: formNations
        ?.getFieldValue('nations')
        ?.map((item: ICountry) => item?.rangeCode)
        ?.includes(record?.rangeCode),
    }),
  };
  useEffect(() => {
    if (data) {
      const newNations = data.content.filter(
        (item) => !nationList.map((nation) => nation.id).includes(item.id)
      );
      const mergedNations = [...nationList, ...newNations];
      setNationList(mergedNations);
    }
  }, [data]);
  useEffect(() => {
    const selectedNations = formNations?.getFieldValue('nations') || [];
    const newSelectedRowKeys = selectedNations.map(
      (item: ICountry) => item?.id
    );
    setSelectedRowKeys(newSelectedRowKeys);
  }, [formNations?.getFieldValue('nations')]);
  const handleSave = (isCloseModal: boolean) => {
    const existingNations = formNations?.getFieldValue('nations')
      ? formNations?.getFieldValue('nations')
      : [];
    const selectedNations =
      nationList.filter((item) => selectedRowKeys.includes(item?.id)) || [];
    const newNations = selectedNations.filter(
      (item: ICountry) =>
        !existingNations.map((item: ICountry) => item?.id).includes(item?.id)
    );
    const mergedNations = [...existingNations, ...newNations];
    formNations?.setFieldValue('nations', mergedNations);
    if (isCloseModal) setIsOpen(false);
    setSelectedRowKeys([]);
  };
  const handleSearch = () => {
    setParams({
      ...params,
      page: 0,
      valueSearch: form.getFieldValue('valueSearch'),
    });
    if (params.valueSearch === form.getFieldValue('valueSearch')) refetch();
  };
  return (
    <CModal
      title="Chọn quốc gia"
      open={open}
      onCancel={() => setIsOpen(false)}
      footer={null}
      width={600}
    >
      <div>
        <Form form={form}>
          <div className="flex justify-between">
            <Form.Item name="valueSearch">
              <CInput
                maxLength={100}
                placeholder="Nhập mã/tên quốc gia"
                onPressEnter={handleSearch}
              />
            </Form.Item>
            <div>
              <CButton type="primary" className="mr-3" onClick={handleSearch}>
                Tìm kiếm
              </CButton>
              <CReloadButton
                onClick={() => {
                  form.resetFields();
                  setParams({ ...params, valueSearch: '' });
                }}
              />
            </div>
          </div>
        </Form>
        <CTable
          className="mt-3"
          columns={columns}
          dataSource={data?.content || []}
          loading={isFetching}
          rowKey={'id'}
          rowSelection={rowSelection}
          pagination={{
            total: data?.totalElements,
            current: params.page + 1,
            pageSize: params.size,
            onChange(page, pageSize) {
              setParams({ ...params, page: page - 1, size: pageSize });
            },
          }}
          scroll={{ y: 300 }}
        />
        <div className="flex justify-end mt-3 items-center gap-2">
          <CButtonSave onClick={() => handleSave(true)} />
          <CButtonClose onClick={() => setIsOpen(false)} />
        </div>
      </div>
    </CModal>
  );
};
export default ChooseNationMadal;
