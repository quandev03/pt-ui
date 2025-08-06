import {
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  IParamsRequest,
} from '@vissoft-react/common';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useColumnsEsimWarehouseList } from '../../hooks/useColumnsEsimWarehouseList';
import { IEsimWarehouseList } from '../../types';
import { ColumnsType } from 'antd/es/table';
import { useGetEsimWarehouseList } from '../../hooks/useGetEsimWarehouseList';

// No props are needed here. The hook will manage its own state.
export const useLogicListEsimWarehouse = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: esimList, isLoading: loadingEsimList } =
    useGetEsimWarehouseList(formatQueryParams<IParamsRequest>(params));

  // --- State for Modals and selected data ---
  const [selectedRecord, setSelectedRecord] =
    useState<IEsimWarehouseList | null>(null);
  const [showEsimDetails, setShowEsimDetails] = useState(false);
  const [isGenQrModalOpen, setGenQrModalOpen] = useState(false);
  const [isSendQrModalOpen, setSendQrModalOpen] = useState(false);

  const handleOpenGenQr = useCallback((record: IEsimWarehouseList) => {
    setSelectedRecord(record);
    setGenQrModalOpen(true);
  }, []);

  const handleCloseGenQr = useCallback(() => {
    setGenQrModalOpen(false);
  }, []);

  const handleOpenSendQr = useCallback((record: IEsimWarehouseList) => {
    setSelectedRecord(record);
    setSendQrModalOpen(true);
  }, []);
  const handleCloseSendQr = useCallback(() => {
    setSendQrModalOpen(false);
  }, []);

  const handleShowDetails = useCallback(() => {
    setShowEsimDetails(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setShowEsimDetails(false);
  }, []);

  const columns: ColumnsType<IEsimWarehouseList> = useColumnsEsimWarehouseList({
    onSendQr: handleOpenSendQr,
    onGenQr: handleOpenGenQr,
    onViewDetails: handleShowDetails,
  });

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'Select',
        name: 'agency',
        label: 'Chọn gói cước',
        placeholder: 'Chọn gói cước',
        options: [],
      },
      {
        type: 'Select',
        name: 'status',
        label: 'Trạng thái thuê bao',
        placeholder: 'Trạng thái thuê bao',
        options: [],
      },
      {
        type: 'Select',
        name: 'status',
        label: 'Trạng thái chặn cắt',
        placeholder: 'Trạng thái chặn cắt',
        options: [],
      },
    ];
  }, []);
  return {
    columns,
    filters,
    esimList,
    loadingEsimList,
    showEsimDetails,
    selectedRecord,
    isGenQrModalOpen,
    isSendQrModalOpen,
    handleCloseSendQr,
    handleCloseGenQr,
    handleCloseModal,
  };
};
