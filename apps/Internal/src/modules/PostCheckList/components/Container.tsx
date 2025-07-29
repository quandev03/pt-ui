import CTableSearch from '@react/commons/TableSearch';
import { Form, Space, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { Key, useCallback, useMemo, useState, useEffect } from 'react';
import { getColumnsTablePostCheckList } from '../constants';
import { IParamsPostCheckList, IPostCheckList } from '../types';
import { ModalSelectedUserReview } from './ModalSelectedUserReview';
import useStorePostCheckList from '../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { Header } from './Header';
import CButton, { CButtonExport } from '@react/commons/Button';
import { useGetListPostCheckList } from '../hooks/uesGetPostCheckList';
import CInputNumber from '@react/commons/InputNumber';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { IParamsRequest } from '@react/commons/types';
import { WrapperButton, RowHeader } from '@react/commons/Template/style';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import dayjs from 'dayjs';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';

const Container = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const actions = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { isPending: isLoadingExport, mutate: exportMutate } =
    useExportMutation();
  const { setIsHiddenModelSelectedReview } = useStorePostCheckList();
  const { data: idTypeData } = useGetApplicationConfig('ID_TYPE');
  const { data: approvalStatusData } = useParameterQuery({
    'table-name': 'SUB_DOCUMENT',
    'column-name': 'APPROVAL_STATUS',
  });
  const { data: auditStatusData } = useParameterQuery({
    'table-name': 'SUB_DOCUMENT',
    'column-name': 'AUDIT_STATUS',
  });

  const [paramTable, setParamTable] = useState<IParamsRequest>({
    page: 0,
    size: 20,
  });
  const { data: dataTable, isFetching } = useGetListPostCheckList(
    queryParams({ ...params, size: 10000 })
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const onSelectChange = useCallback((newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: (record: IPostCheckList) => ({
        disabled: record.auditStatus === 1,
      }),
    };
  }, [onSelectChange, selectedRowKeys]);

  const handleChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      setParamTable({
        ...paramTable,
        page: (pagination.current as number) - 1,
        size: pagination.pageSize as number,
      });
    },
    [params]
  );
  const { isHiddenModelSelectedReview } = useStorePostCheckList();
  const handleAction = useCallback((id: string) => {
    navigate(pathRoutes.post_check_list_view(id));
  }, []);

  const columns: ColumnsType<IPostCheckList> = useMemo(() => {
    return getColumnsTablePostCheckList(
      params,
      idTypeData || [],
      approvalStatusData || [],
      auditStatusData || [],
      actions,
      {
        onAction: handleAction,
      }
    );
  }, [
    params,
    idTypeData,
    approvalStatusData,
    auditStatusData,
    actions,
    handleAction,
  ]);

  const [recordStart, setRecordStart] = useState<number | null>(null);
  const [recordEnd, setRecordEnd] = useState<number | null>(null);
  const [isDisabledBtn, setIsDisabledBtn] = useState<boolean>(true);

  const validateField = (fieldName: string, value: string | number) => {
    if (value !== null && Number(value) === 0) {
      form.setFields([
        {
          name: fieldName,
          errors: ['Dữ liệu không hợp lệ'],
        },
      ]);
    } else {
      form.setFields([
        {
          name: fieldName,
          errors: [],
        },
      ]);
    }
  };

  const handleValuesChange = useCallback(
    (changedValues: any, allValues: any) => {
      if ('recordStart' in changedValues) {
        validateField('recordStart', changedValues.recordStart);
      }
      if ('recordEnd' in changedValues) {
        validateField('recordEnd', changedValues.recordEnd);
      }

      const start = Number(allValues.recordStart);
      const end = Number(allValues.recordEnd);

      if ((allValues.recordStart !== null && start === 0) || start > end) {
        form.setFields([
          { name: 'recordStart', errors: ['Dữ liệu không hợp lệ'] },
        ]);
      } else {
        form.setFields([{ name: 'recordStart', errors: [] }]);
      }

      setIsDisabledBtn(!start || !end);
    },
    [form]
  );

  const handleFinish = useCallback((values: any) => {
    setRecordStart(Number(values.recordStart));
    setRecordEnd(Number(values.recordEnd));
  }, []);

  useEffect(() => {
    if (
      recordStart !== null &&
      recordEnd !== null &&
      recordStart > 0 &&
      recordEnd > 0
    ) {
      const newSelectedRowKeys = dataTable?.content
        ?.filter(
          (item: any, index: number) =>
            index + 1 >= recordStart &&
            index + 1 <= recordEnd &&
            item.auditStatus !== '1'
        )
        .map((item: any) => item.id);
      setSelectedRowKeys(newSelectedRowKeys || []);
    }
  }, [recordStart, recordEnd, dataTable]);

  const handleExportData = () => {
    const { page, size, ...rest } = queryParams(params) as IParamsPostCheckList;
    exportMutate({
      uri: `${prefixCustomerService}/export-audit-sub-document`,
      filename: `danh_sach_hau_kiem-${dayjs().format(DateFormat.EXPORT)}.xlsx`,
      params: rest,
    });
  };

  return (
    <div>
      <Header />
      <Form
        form={form}
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
      >
        <RowHeader>
          <Space align="start">
            <Form.Item name="recordStart" className="mb-0">
              <CInputNumber
                type="number"
                placeholder="Nhập số bản ghi từ"
                min={0}
                max={1000}
                precision={0}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  ['-', '+', '.'].includes(e.key) && e.preventDefault()
                }
              />
            </Form.Item>
            <Form.Item name="recordEnd" className="mb-0">
              <CInputNumber
                type="number"
                placeholder="Nhập số bản ghi đến"
                min={0}
                max={1000}
                precision={0}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  ['-', '+', '.'].includes(e.key) && e.preventDefault()
                }
              />
            </Form.Item>
            <CButton disabled={isDisabledBtn} htmlType="submit">
              Chọn
            </CButton>
            <div className="font-medium text-[#ff4d4f] mt-1.5">
              Số bản ghi thực tế khi tìm kiếm: {dataTable?.totalElements ?? 0}
            </div>
          </Space>
          <WrapperButton>
            {actions.includes(ActionsTypeEnum.RE_CENSOR) && (
              <CButton
                disabled={!selectedRowKeys?.length}
                onClick={() => setIsHiddenModelSelectedReview(true)}
              >
                Kiểm duyệt lại
              </CButton>
            )}
            <CButtonExport
              onClick={handleExportData}
              loading={isLoadingExport}
            />
          </WrapperButton>
        </RowHeader>
      </Form>
      <CTableSearch<IPostCheckList>
        rowKey={'id'}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataTable?.content ?? []}
        loading={isFetching}
        pagination={{
          current: paramTable.page + 1,
          pageSize: paramTable.size,
          total:
            (dataTable?.totalElements ?? 0 > (dataTable?.numberOfElements ?? 0)
              ? dataTable?.numberOfElements
              : dataTable?.totalElements) ?? 0,
          totalElements: dataTable?.totalElements ?? 0,
        }}
        onChange={handleChangeTable}
      />

      <ModalSelectedUserReview
        setSelectedRowKeys={setSelectedRowKeys}
        ids={selectedRowKeys as string[]}
        open={isHiddenModelSelectedReview}
      />
    </div>
  );
};

export default Container;
