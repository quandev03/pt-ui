import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Row, Space } from 'antd';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import CButton, { CButtonAdd, CButtonClose } from '@react/commons/Button';
import CModal from '@react/commons/Modal';
import CTable from '@react/commons/Table';
import { RowHeader } from '@react/commons/Template/style';
import { cleanUpString } from '@react/helpers/utils';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useGetUsers } from '../../UserManagement/queryHooks';
import { IUserItem, IUserParams } from '../../UserManagement/types';
import { getColumnsTableSelectedUser } from '../constants';
import '../index.scss';
import { TableType } from '../type';

type PropsModal = {
  open: boolean;
  onClose: () => void;
  onSave: (data: IUserItem[]) => void;
};

const ModalSelectedUser: FC<PropsModal> = ({ open, onClose, onSave }) => {
  const form = useFormInstance();
  const stockIsdnOrgPermissionDTOS =
    useWatch<TableType[]>('stockIsdnOrgPermissionDTOS', form) ?? [];
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<IUserItem[]>([]);

  const [searchParams, setSearchParams] = useState<IUserParams>({
    page: 0,
    size: 20,
    q: '',
  });
  const { data: listUser, isLoading: loadingTable } = useGetUsers(searchParams);

  useEffect(() => {
    if (open) {
      const stockIsdnOrgPermissionDTOS: TableType[] =
        form.getFieldValue('stockIsdnOrgPermissionDTOS') ?? [];
      setSelectedRows(
        stockIsdnOrgPermissionDTOS.map(
          (item) =>
            ({
              ...item,
              id: item.userId,
            } as any)
        )
      );
      setSelectedRowKeys(stockIsdnOrgPermissionDTOS.map((item) => item.userId));
    }
  }, [open]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (selectedRowKeys: React.Key[], selectedRows: IUserItem[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
      },
      getCheckboxProps: (record: any) => ({
        disabled: stockIsdnOrgPermissionDTOS
          .map(({ userId }) => userId)
          .includes(record.id),
      }),
      preserveSelectedRowKeys: true,
    }),
    [setSelectedRowKeys, setSelectedRows, selectedRowKeys]
  );

  const handleCloseModal = useCallback(() => {
    onClose();
    handleRefresh();
  }, []);

  const handleSubmit = useCallback(() => {
    setSearchParams({
      ...searchParams,
      page: 0,
      q: searchValue,
    });
  }, [searchParams, searchValue]);

  const handleRefresh = useCallback(() => {
    setSearchParams({
      ...searchParams,
      page: 0,
      q: '',
    });
    setSearchValue('');
  }, [searchParams]);

  const handleAdd = useCallback(() => {
    onSave(selectedRows);
    handleRefresh();
    onClose();
  }, [selectedRows]);

  const columns = getColumnsTableSelectedUser(searchParams);

  return (
    <CModal
      width={1000}
      footer={null}
      onCancel={handleCloseModal}
      open={open}
      title="Chọn user"
    >
      <RowHeader>
        <Space>
          <Input
            className="min-w-[200px]"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            maxLength={100}
            onBlur={() => setSearchValue(cleanUpString(searchValue))} // Ensure onBlur updates the state
            placeholder="Nhập username để tìm kiếm"
          />
          <CButton onClick={handleSubmit}>Tìm kiếm</CButton>
          <FontAwesomeIcon
            icon={faRotateLeft}
            size="lg"
            className="cursor-pointer self-center"
            onClick={handleRefresh}
            title="Làm mới"
          />
        </Space>
      </RowHeader>
      <CTable
        dataSource={listUser?.content ?? []}
        columns={columns}
        loading={loadingTable}
        rowKey={'id'}
        rowSelection={rowSelection}
        scroll={{ y: '450px' }}
        pagination={{
          current: searchParams.page + 1,
          pageSize: searchParams.size,
          total: listUser?.totalElements ?? 0,
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              page: page - 1,
              size: pageSize,
            });
          },
        }}
      />
      <Row className="w-full" justify="end">
        <Space>
          <CButtonAdd
            disabled={selectedRowKeys.length === 0}
            onClick={handleAdd}
          >
            Thêm
          </CButtonAdd>
          <CButtonClose onClick={handleCloseModal} />
        </Space>
      </Row>
    </CModal>
  );
};

export default ModalSelectedUser;
