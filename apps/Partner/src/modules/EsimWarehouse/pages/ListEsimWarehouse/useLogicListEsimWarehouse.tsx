import {
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  IParamsRequest,
} from '@vissoft-react/common';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useColumnsEsimWarehouseList } from '../../hooks/useColumnsEsimWarehouseList';
import { IEsimWarehouseList } from '../../types';
import { ColumnsType } from 'antd/es/table';
import { useGetEsimWarehouseList } from '../../hooks/useGetEsimWarehouseList';
import { useGetPackageCodes } from '../../hooks/useGetPackagesCode';
import { DefaultOptionType } from 'antd/es/select';
import {
  ActiveStatusEnum,
  activeStatusMap,
  Status900Enum,
  status900Map,
} from '../../constants/enum';
import { message } from 'antd';
import { useGetGenQrCode } from '../../hooks/useGetGenQrCode';

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
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const handleOpenSendQr = useCallback((record: IEsimWarehouseList) => {
    setSelectedRecord(record);
    setSendQrModalOpen(true);
  }, []);
  const handleCloseSendQr = useCallback(() => {
    setSendQrModalOpen(false);
  }, []);

  const handleShowDetails = useCallback((record: IEsimWarehouseList) => {
    setSelectedRecord(record);
    setShowEsimDetails(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setShowEsimDetails(false);
  }, []);

  const onGenQrSuccess = (imageBlob: Blob) => {
    const url = URL.createObjectURL(imageBlob);

    setQrCodeUrl(url);
  };
  const onGenQrError = () => {
    message.error('Không tạo được mã QR. Vui lòng thử lại');
  };

  const { mutate: genQrCode, isPending: genQrCodeInProcess } = useGetGenQrCode(
    onGenQrSuccess,
    onGenQrError
  );

  const handleOpenGenQrModal = useCallback(
    (record: IEsimWarehouseList) => {
      setSelectedRecord(record);
      setGenQrModalOpen(true);
      genQrCode({
        subId: record.subId,
        size: '200x200',
      });
    },
    [genQrCode]
  );

  const handleCloseGenQrModal = useCallback(() => {
    setGenQrModalOpen(false);
    setSelectedRecord(null);
  }, []);

  useEffect(() => {
    return () => {
      if (qrCodeUrl) {
        console.log('Revoking old Blob URL:', qrCodeUrl);
        URL.revokeObjectURL(qrCodeUrl);
        setQrCodeUrl(null);
      }
    };
  }, [qrCodeUrl]);

  const columns: ColumnsType<IEsimWarehouseList> = useColumnsEsimWarehouseList({
    onSendQr: handleOpenSendQr,
    onGenQr: handleOpenGenQrModal,
    onViewDetails: handleShowDetails,
  });
  const { data: packageCodeList } = useGetPackageCodes();

  const packageOptions: DefaultOptionType[] = useMemo(() => {
    return packageCodeList
      ? packageCodeList
          .filter((pkg) => pkg.pckCode)
          .map((pkg) => ({
            label: pkg.pckCode,
            value: pkg.pckCode,
          }))
      : [];
  }, [packageCodeList]);

  const subStatusOptions: DefaultOptionType[] = useMemo(
    () => [
      {
        value: Status900Enum.NOT_CALLED,
        label: status900Map[Status900Enum.NOT_CALLED].text,
      },
      {
        value: Status900Enum.CALLED,
        label: status900Map[Status900Enum.CALLED].text,
      },
    ],
    []
  );

  const activeStatusOptions: DefaultOptionType[] = useMemo(
    () => [
      {
        value: ActiveStatusEnum.NORMAL,
        label: activeStatusMap[ActiveStatusEnum.NORMAL].text,
      },
      {
        value: ActiveStatusEnum.ONE_WAY_CALL_BLOCK_BY_REQUEST,
        label:
          activeStatusMap[ActiveStatusEnum.ONE_WAY_CALL_BLOCK_BY_REQUEST].text,
      },
      {
        value: ActiveStatusEnum.ONE_WAY_CALL_BLOCK_BY_PROVIDER,
        label:
          activeStatusMap[ActiveStatusEnum.ONE_WAY_CALL_BLOCK_BY_PROVIDER].text,
      },
      {
        value: ActiveStatusEnum.TWO_WAY_CALL_BLOCK_BY_REQUEST,
        label:
          activeStatusMap[ActiveStatusEnum.TWO_WAY_CALL_BLOCK_BY_REQUEST].text,
      },
      {
        value: ActiveStatusEnum.TWO_WAY_CALL_BLOCK_BY_PROVIDER,
        label:
          activeStatusMap[ActiveStatusEnum.TWO_WAY_CALL_BLOCK_BY_PROVIDER].text,
      },
    ],
    []
  );

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'Select',
        name: 'pckCode',
        label: 'Chọn gói cước',
        placeholder: 'Chọn gói cước',
        options: packageOptions,
      },
      {
        type: 'Select',
        name: 'subStatus',
        label: 'Trạng thái thuê bao',
        placeholder: 'Trạng thái thuê bao',
        options: subStatusOptions,
      },
      {
        type: 'Select',
        name: 'activeStatus',
        label: 'Trạng thái chặn cắt',
        placeholder: 'Trạng thái chặn cắt',
        options: activeStatusOptions,
      },
    ];
  }, [activeStatusOptions, packageOptions, subStatusOptions]);
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
    handleCloseModal,
    genQrCodeInProcess,
    onGenQrSuccess,
    handleCloseGenQrModal,
    genQrCode,
    qrCodeUrl,
  };
};
