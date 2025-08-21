import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTableList } from '../../hooks/useGetTableList';

import {
  CButtonExport,
  decodeSearchParams,
  FilterItemProps,
  formatDate,
  formatDateExport,
  formatQueryParams,
  IModeAction,
  usePermissions,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import { useGetAllOrganizationUnit } from 'apps/Internal/src/hooks/useGetAllPartners';
import useConfigAppStore from '../../../Layouts/stores';
import { useGetAllPackage, useGeteSIMStock } from '../../hooks';
import { IeSIMStockItem, IeSIMStockParams } from '../../types';
import { useExportFile } from 'apps/Internal/src/hooks/useExportFile';
import { prefixSaleService } from 'apps/Internal/src/constants';
import dayjs from 'dayjs';

export const useLogicListeSIMStock = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const {
    params: { SUBSCRIBER_SUB_STATUS = [], SUBSCRIBER_ACTIVE_SUB_STATUS = [] },
  } = useConfigAppStore();

  const { data: listeSIMStock, isLoading: loadingTable } = useGeteSIMStock(
    formatQueryParams<IeSIMStockParams>(params)
  );
  const { data: listPackage } = useGetAllPackage();

  const handleOpenModal = (record: IeSIMStockItem) => {
    setOpenModal(true);
    setId(record.subId);
  };
  const handleCloseModal = () => setOpenModal(false);

  const columns: ColumnsType<IeSIMStockItem> = useGetTableList(
    handleOpenModal,
    SUBSCRIBER_SUB_STATUS,
    SUBSCRIBER_ACTIVE_SUB_STATUS
  );
  const { data: agencyOptions = [] } = useGetAllOrganizationUnit();
  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        label: 'Chọn gói cước',
        type: 'Select',
        name: 'pckCode',
        stateKey: 'pckCode',
        showDefault: true,
        options:
          listPackage?.map((pkg) => ({
            label: pkg.pckCode,
            value: pkg.pckCode + '',
          })) || [],
        placeholder: 'Chọn gói cước',
      },
      {
        label: 'Đối tác',
        type: 'TreeSelect',
        name: 'orgId',
        showDefault: true,
        treeData: agencyOptions,
        placeholder: 'Đại lý',
        showSearch: true,
      },

      {
        label: 'Trạng thái thuê bao',
        type: 'Select',
        name: 'subStatus',
        stateKey: 'subStatus',
        showDefault: true,
        options:
          SUBSCRIBER_SUB_STATUS?.map((item) => ({
            label: item.value,
            value: item.code + '',
          })) || [],
        placeholder: 'Trạng thái thuê bao',
        showSearch: false,
      },
      {
        label: 'Trạng thái chặn cắt',
        type: 'Select',
        name: 'activeStatus',
        stateKey: 'activeStatus',
        showDefault: true,
        options:
          SUBSCRIBER_ACTIVE_SUB_STATUS?.map((item) => ({
            label: item.value,
            value: item.code + '',
          })) || [],
        placeholder: 'Trạng thái chặn cắt',
        showSearch: false,
      },
    ];
  }, [listPackage, agencyOptions]);
  const { mutate: exportFile } = useExportFile();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const handleExport = () => {
    const { page, size, ...rest } = params;
    exportFile({
      params: rest,
      url: `${prefixSaleService}/esim-manager/export`,
      filename: `Danh_sach_esim_${dayjs().format(formatDateExport)}.xlsx`,
    });
  };
  const actionComponent = useMemo(() => {
    return (
      <div>
        {permission.hasPermission(IModeAction.EXPORT_EXCEL) && (
          <CButtonExport onClick={handleExport} />
        )}
      </div>
    );
  }, [permission]);

  return {
    listeSIMStock,
    loadingTable,
    columns,
    filters,
    openModal,
    handleCloseModal,
    id,
    actionComponent,
  };
};
