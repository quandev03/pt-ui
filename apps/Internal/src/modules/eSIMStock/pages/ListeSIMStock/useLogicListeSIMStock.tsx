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
  ActiveStatusLabel,
  IeSIMStockItem,
  IeSIMStockParams,
} from '../../types';
import {
  useGetAllOrganizationUnit,
  useGetAllPackage,
  useGeteSIMStock,
} from '../../hooks';

export const useLogicListeSIMStock = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: listeSIMStock, isLoading: loadingTable } = useGeteSIMStock(
    formatQueryParams<IeSIMStockParams>(params)
  );
  const { data: listPackage } = useGetAllPackage();
  const { data: listOrganizationUnit } = useGetAllOrganizationUnit();

  const handleOpenModal = (record: IeSIMStockItem) => {
    setOpenModal(true);
    setId(record.subId);
  };
  const handleCloseModal = () => setOpenModal(false);

  const columns: ColumnsType<IeSIMStockItem> = useGetTableList(handleOpenModal);

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
          value: pkg.pckCode,
        })),
        placeholder: 'Chọn gói cước',
      },
      {
        label: 'Đại lý',
        type: 'Select',
        name: 'orgId',
        stateKey: 'orgId',
        showDefault: true,
        options: listOrganizationUnit?.map((org) => ({
          label: org.orgName,
          value: org.id,
        })),
        placeholder: 'Đại lý',
      },

      {
        label: 'Trạng thái thuê bao',
        type: 'Select',
        name: 'subStatus',
        stateKey: 'subStatus',
        showDefault: true,
        options: [
          { label: 'Hoạt động', value: 1 },
          { label: 'Không hoạt động', value: 0 },
        ],
        placeholder: 'Trạng thái thuê bao',
      },
      {
        label: 'Trạng thái chặn cắt',
        type: 'Select',
        name: 'activeStatus',
        stateKey: 'activeStatus',
        showDefault: true,
        options: Object.entries(ActiveStatusLabel).map(([value, label]) => ({
          label,
          value: Number(value),
        })),
        placeholder: 'Trạng thái chặn cắt',
      },
    ];
  }, [listOrganizationUnit, listPackage]);

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
