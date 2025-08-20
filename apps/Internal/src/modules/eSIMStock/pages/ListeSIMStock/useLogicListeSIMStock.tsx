import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTableList } from '../../hooks/useGetTableList';

import {
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import { useGetAllOrganizationUnit } from 'apps/Internal/src/hooks/useGetAllPartners';
import useConfigAppStore from '../../../Layouts/stores';
import { useGetAllPackage, useGeteSIMStock } from '../../hooks';
import {
  ActiveStatusOptions,
  IeSIMStockItem,
  IeSIMStockParams,
} from '../../types';

export const useLogicListeSIMStock = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const {
    params: { SUBSCRIBER_SUB_STATUS = [] },
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
    SUBSCRIBER_SUB_STATUS
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
        options: listPackage?.map((pkg) => ({
          label: pkg.pckCode,
          value: pkg.pckCode + '',
        })),
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
        options: SUBSCRIBER_SUB_STATUS,
        placeholder: 'Trạng thái thuê bao',
      },
      {
        label: 'Trạng thái chặn cắt',
        type: 'Select',
        name: 'activeStatus',
        stateKey: 'activeStatus',
        showDefault: true,
        options: ActiveStatusOptions,
        placeholder: 'Trạng thái chặn cắt',
      },
    ];
  }, [listPackage, agencyOptions]);

  return {
    listeSIMStock,
    loadingTable,
    columns,
    filters,
    openModal,
    handleCloseModal,
    id,
  };
};
