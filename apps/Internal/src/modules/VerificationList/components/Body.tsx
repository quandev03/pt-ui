import CButton, { CButtonExport } from '@react/commons/Button';
import { CTable } from '@react/commons/index';
import CInputNumber from '@react/commons/InputNumber';
import { RowHeader, Text, WrapperButton } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Form, Row, TablePaginationConfig } from 'antd';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs, { Dayjs } from 'dayjs';
import { includes } from 'lodash';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useColumnVerification } from '../hooks/useColumnVerification';
import { useList } from '../hooks/useList';
import { useListForStaff } from '../hooks/useListForStaff';
import { StyledButton } from '../page/styled';
import useCensorshipStore from '../store';
import { CENSORSHIPSTT, IVerificationItem } from '../types';
import AssignModal from './AssignModal';
import Header from './Header';
import { TotalTableMessage } from '@react/commons/Template/TotalTableMessage';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';

const Body = () => {
  const actionByRole = useRolesByRouter();
  const { isAdmin, isClickSearch, setIsDisableSync } = useCensorshipStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paramsFake, setParamsFake] = useState<AnyElement>({
    page: 0,
    size: 20,
  });
  console.log(paramsFake, 'paramsFake');
  const { mutate: downloadFile } = useExportMutation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [disableSelectBtn, setDisableSelectBtn] = useState(true);
  const params = decodeSearchParams(searchParams);
  const [formSelect] = Form.useForm();
  const recordFrom = Form.useWatch('recordFrom', formSelect);
  const recordTo = Form.useWatch('recordTo', formSelect);
  const { data: verificationItems, isPending: loadingTable } = useList(
    queryParams(params)
  );
  const { data: staffVerificationItems, isPending: loadingTableStaff } =
    useListForStaff(queryParams(params));
  const { data: auditRejectReasons } = useReasonCustomerService('AUDIT_REJECT');
  const [filter, setFilter] = useState<AnyElement>({});
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const handleFilterChangeState = useCallback(
    async (name: string, value: string | null | undefined | Dayjs) => {
      setIsSearching(true);
      setFilter((prevFilter: AnyElement) => ({ ...prevFilter, [name]: value }));
      setIsSearching(false);
    },
    [setFilter]
  );
  const { data: optionsActiveChannel } = useGetApplicationConfig(
    'REPORT_PARAM_ACTIVE_CHANNEL'
  );
  const dataTable = isAdmin ? verificationItems : staffVerificationItems;
  const data = useMemo(() => {
    if (!dataTable?.content) return [];

    return dataTable.content.filter((item) => {
      return (
        (!filter.contractNo ||
          item.contractNo
            ?.toLowerCase()
            .includes(filter.contractNo.toLowerCase())) &&
        (!filter.customerCode ||
          item.customerCode
            ?.toLowerCase()
            .includes(filter.customerCode.toLowerCase())) &&
        (!filter.custType ||
          item.custType
            ?.toLowerCase()
            .includes(filter.custType.toLowerCase())) &&
        (!filter.phoneNumber ||
          item.phoneNumber
            .toString()
            .includes(filter.phoneNumber.toString())) &&
        (!filter.userName ||
          item.userName
            ?.toLowerCase()
            .includes(filter.userName.toLowerCase())) &&
        (!filter.birthDate ||
          (item.birthDate &&
            dayjs(item.birthDate).format(formatDateEnglishV2) ===
              dayjs(filter.birthDate).format(formatDateEnglishV2))) &&
        (!filter.idType ||
          item.idType?.toLowerCase().includes(filter.idType.toLowerCase())) &&
        (!filter.idNo ||
          item.idNo?.toLowerCase().includes(filter.idNo.toLowerCase())) &&
        (!filter.activeUser ||
          item.activeUser
            ?.toLowerCase()
            .includes(filter.activeUser.toLowerCase())) &&
        (!filter.clientName ||
          item.clientName
            ?.toLowerCase()
            .includes(filter.clientName.toLowerCase())) &&
        (!filter.activeDate ||
          (item.activeDate &&
            dayjs(item.activeDate).format(formatDateEnglishV2) ===
              dayjs(filter.activeDate).format(formatDateEnglishV2))) &&
        (!filter.activeChannel ||
          item.activeChannel
            ?.toLowerCase()
            .includes(filter.activeChannel.toLowerCase())) &&
        (filter.customerStatus === null ||
          filter.customerStatus === undefined ||
          item.customerStatus === filter.customerStatus) &&
        (!filter.assignUserName ||
          item.assignUserName
            ?.toLowerCase()
            .includes(filter.assignUserName.toLowerCase())) &&
        (!filter.approveStatus ||
          item.approveStatus === filter.approveStatus) &&
        (filter.docUpdateStatus === null ||
          filter.docUpdateStatus === undefined ||
          item.docUpdateStatus === filter.docUpdateStatus) &&
        (!filter.docUpdateDate ||
          (item.docUpdateDate &&
            dayjs(item.docUpdateDate).format(formatDateEnglishV2) ===
              dayjs(filter.docUpdateDate).format(formatDateEnglishV2))) &&
        (filter.auditStatus === null ||
          filter.auditStatus === undefined ||
          item.auditStatus === filter.auditStatus) &&
        (!filter.auditRejectReasonCode ||
          item.auditRejectReasonCode
            ?.toLowerCase()
            .includes(filter.auditRejectReasonCode.toLowerCase())) &&
        (filter.assignStatus === null ||
          filter.assignStatus === undefined ||
          item.assignStatus === filter.assignStatus) &&
        (!filter.assignDate ||
          (item.assignDate &&
            dayjs(item.assignDate).format(formatDateEnglishV2) ===
              dayjs(filter.assignDate).format(formatDateEnglishV2)))
      );
    });
  }, [filter, dataTable]);
  const onSelectChange = useCallback((newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: (record: IVerificationItem) => ({
        disabled:
          record.approveStatus === CENSORSHIPSTT.Approved ||
          (record.approveStatus === CENSORSHIPSTT.UpdateRequired &&
            record.docUpdateStatus === 0),
      }),
    };
  }, [onSelectChange, selectedRowKeys]);
  const handleChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      console.log(pagination, 'pagination');
      setParamsFake({
        ...paramsFake,
        page: Number(pagination.current) - 1,
        size: pagination.pageSize as number,
      });
    },
    [params]
  );
  useEffect(() => {
    if (recordFrom && recordTo) {
      setDisableSelectBtn(false);
    } else {
      setDisableSelectBtn(true);
    }
    if (recordFrom === 0) {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: ['Dữ liệu không hợp lệ'],
        },
      ]);
    } else {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: [],
        },
      ]);
    }
    if (recordTo === 0) {
      formSelect.setFields([
        {
          name: 'recordTo',
          errors: ['Dữ liệu không hợp lệ'],
        },
      ]);
    } else {
      formSelect.setFields([
        {
          name: 'recordTo',
          errors: [],
        },
      ]);
    }
  }, [recordFrom, recordTo]);
  const handleFinishSelect = () => {
    if (recordFrom > recordTo) {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: ['Dữ liệu không hợp lệ'],
        },
      ]);
      return;
    } else {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: [],
        },
      ]);
    }
    setSelectedRowKeys(
      verificationItems?.content
        .slice(recordFrom - 1, recordTo)
        .filter(
          (item) =>
            item.approveStatus !== CENSORSHIPSTT.Approved &&
            item.docUpdateStatus !== 0
        )
        .map((item) => item.subDocumentId) || []
    );
  };

  const downloadUrl = `${prefixCustomerService}/${
    isAdmin ? 'export-sub-document-admin' : 'export-sub-document-staff'
  }`;

  const handleDownload = () => {
    const { type, ...rest } = params;
    const exportParams = isAdmin ? params : { ...rest, typeDate: type };
    const filename = `Danh_sach_kiem_duyet_${
      isAdmin ? 'admin' : 'CSKH'
    }_${dayjs().format(formatDate)}.xlsx`;
    downloadFile({
      uri: downloadUrl,
      params: queryParams({ ...exportParams, size: 10000 }),
      filename: filename,
    });
  };
  const totalElements = useMemo(() => {
    if (dataTable) {
      if (dataTable.totalElements > 10000) return 10000;
      return dataTable.totalElements;
    }
    return 0;
  }, [dataTable]);
  const isDisableBtn = selectedRowKeys.length === 0;

  useEffect(() => {
    if (isClickSearch) {
      formSelect.resetFields();
      setSelectedRowKeys([]);
      setFilter({});
    }
  }, [isClickSearch]);

  const handleRowDoubleClick = (record: IVerificationItem) => {
    if (
      includes(actionByRole, ActionsTypeEnum.READ) &&
      (record.approveStatus === CENSORSHIPSTT.Pending ||
        record.approveStatus === CENSORSHIPSTT.Recheck)
    ) {
      navigate(pathRoutes.verification_approve(record.subscriberId + ''));
    } else if (
      includes(actionByRole, ActionsTypeEnum.READ) &&
      record.approveStatus === CENSORSHIPSTT.UpdateRequired &&
      record.docUpdateStatus === 1
    ) {
      navigate(pathRoutes.censorship_history_view(record.subDocumentId));
    }
  };
  const columns = useColumnVerification(
    filter,
    handleFilterChangeState,
    paramsFake,
    isAdmin,
    actionByRole,
    setIsDisableSync,
    navigate,
    auditRejectReasons || [],
    optionsActiveChannel || []
  );
  return (
    <div>
      <Header />
      <RowHeader className={isAdmin ? 'mt-3 ml-[-4px]' : 'mt-3'}>
        {isAdmin && (
          <Form form={formSelect} onFinish={handleFinishSelect}>
            <Row>
              <Form.Item name={'recordFrom'} className="w-36">
                <CInputNumber
                  type="number"
                  min={1}
                  max={10000}
                  precision={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    ['-', '+', '.', 'e', ','].includes(e.key) &&
                    e.preventDefault()
                  }
                  placeholder="Nhập bản ghi từ"
                />
              </Form.Item>

              <Form.Item name={'recordTo'} className="w-36 ml-2">
                <CInputNumber
                  type="number"
                  min={1}
                  max={10000}
                  precision={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    ['-', '+', '.', 'e', ','].includes(e.key) &&
                    e.preventDefault()
                  }
                  placeholder="Nhập bản ghi đến"
                />
              </Form.Item>

              <CButton
                htmlType="submit"
                disabled={disableSelectBtn}
                className="ml-2"
              >
                Chọn
              </CButton>
              <Text type="danger" className={'mt-2 !text-[14px] ml-2'}>
                Số bản ghi thực tế khi tìm kiếm: {dataTable?.totalElements || 0}
              </Text>
            </Row>
          </Form>
        )}
        {!isAdmin && (
          <Text type="danger" className={'self-end !text-[14px]'}>
            Số bản ghi thực tế khi tìm kiếm: {dataTable?.totalElements || 0}
          </Text>
        )}
        <WrapperButton className="mr-1">
          {includes(actionByRole, ActionsTypeEnum.ASSIGN) && isAdmin && (
            <StyledButton
              disableStyle={isDisableBtn}
              disabled={isDisableBtn}
              onClick={() => setIsOpenModal(true)}
            >
              Phân công
            </StyledButton>
          )}
          <CButtonExport onClick={handleDownload} />
        </WrapperButton>
      </RowHeader>
      <CTable
        columns={columns}
        rowKey={'subDocumentId'}
        loading={(isAdmin ? loadingTable : loadingTableStaff) || isSearching}
        rowSelection={isAdmin ? rowSelection : undefined}
        dataSource={data || []}
        pagination={
          !data
            ? false
            : {
                current: paramsFake.page + 1,
                pageSize: paramsFake.size,
                total: totalElements,
                showTotal: () => TotalTableMessage(totalElements),
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onChange: () => {},
              }
        }
        onChange={handleChangeTable}
        className="mt-3 text-[13px] ml-[-4px] mr-[-8px]"
        onRow={(record) => {
          return {
            onDoubleClick: () => handleRowDoubleClick(record),
          };
        }}
      />
      <AssignModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        ids={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        resetFormSelect={() => formSelect.resetFields()}
      />
    </div>
  );
};
export default Body;
