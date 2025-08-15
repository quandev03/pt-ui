import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTableList } from '../../hooks/useGetTableList';

import {
  decodeSearchParams,
  formatQueryParams,
  FilterItemProps,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import {
  ActiveStatusOptions,
  IeSIMStockItem,
  IeSIMStockParams,
  SubscriberStatusOptions,
} from '../../types';
import { useGetAllPackage, useGeteSIMStock } from '../../hooks';
import { useGetAllOrganizationUnit } from 'apps/Internal/src/hooks/useGetAllPartners';

export const useLogicListeSIMStock = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: listeSIMStock, isLoading: loadingTable } = useGeteSIMStock(
    formatQueryParams<IeSIMStockParams>(params)
  );
  const { data: listPackage } = useGetAllPackage();

  const handleOpenModal = (record: IeSIMStockItem) => {
    setOpenModal(true);
    setId(record.subId);
  };
  const handleCloseModal = () => setOpenModal(false);

  const columns: ColumnsType<IeSIMStockItem> = useGetTableList(handleOpenModal);
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
        options: SubscriberStatusOptions,
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
