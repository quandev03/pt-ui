import {
  CButtonExport,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  usePermissions,
} from '@vissoft-react/common';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useColumnsEsimWarehouseList } from '../../hooks/useColumnsEsimWarehouseList';
import { IEsimWarehouseList, IEsimWarehouseParams } from '../../types';
import { ColumnsType } from 'antd/es/table';
import { useGetEsimWarehouseList } from '../../hooks/useGetEsimWarehouseList';
import { useGetPackageCodes } from '../../hooks/useGetPackagesCode';
import { DefaultOptionType } from 'antd/es/select';
import { useGetGenQrCode } from '../../hooks/useGetGenQrCode';
import { useGetAgencyOptions } from '../../../../hooks/useGetAgencyOptions';
import { useGetExportEsim } from '../../hooks/useGetExportEsim';
import useConfigAppStore from '../../../Layouts/stores';
import { useGetParamsOption } from '../../../../hooks/useGetParamsOption';
import { ISelectOption } from '../../../SalePackage/types';

export const useLogicListEsimWarehouse = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: esimList, isLoading: loadingEsimList } =
    useGetEsimWarehouseList(formatQueryParams<IEsimWarehouseParams>(params));
  const { data: agencyOptions = [] } = useGetAgencyOptions();
  const { mutate: exportEsimList, isPending: isExporting } = useGetExportEsim();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);

  const [selectedRecord, setSelectedRecord] =
    useState<IEsimWarehouseList | null>(null);
  const [showEsimDetails, setShowEsimDetails] = useState(false);
  const [isGenQrModalOpen, setGenQrModalOpen] = useState(false);
  const [isSendQrModalOpen, setSendQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const { data: getParams } = useGetParamsOption();

  const subStatusOptions: ISelectOption[] = useMemo(() => {
    if (!getParams?.SUBSCRIBER_SUBS_STATUS) {
      return [];
    }
    return getParams.SUBSCRIBER_SUBS_STATUS.map((item) => ({
      value: item.code,
      label: item.value,
    }));
  }, [getParams]);

  const activeStatusOptions: ISelectOption[] = useMemo(() => {
    if (!getParams?.SUBSCRIBER_ACTIVE_SUB_STATUS) {
      return [];
    }
    return getParams.SUBSCRIBER_ACTIVE_SUB_STATUS.map((item) => ({
      value: item.code,
      label: item.value,
    }));
  }, [getParams]);

  const handleExport = useCallback(() => {
    exportEsimList({
      ...params,
      fileFormat: 'xlsx',
    });
  }, [exportEsimList, params]);

  const exportComponent = useMemo(() => {
    return (
      <div>
        {permission.canCreate && (
          <CButtonExport onClick={handleExport} loading={isExporting} />
        )}
      </div>
    );
  }, [handleExport, permission.canCreate, isExporting]);

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
    setGenQrModalOpen(true);
  };

  const { mutate: genQrCode, isPending: genQrCodeInProcess } =
    useGetGenQrCode(onGenQrSuccess);

  const handleOpenGenQrModal = useCallback(
    (record: IEsimWarehouseList) => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
        setQrCodeUrl(null);
      }
      setSelectedRecord(record);
      genQrCode({
        subId: record.subId,
        size: '200x200',
      });
    },
    [genQrCode, qrCodeUrl]
  );

  const handleCloseGenQrModal = useCallback(() => {
    setGenQrModalOpen(false);
    setSelectedRecord(null);
    if (qrCodeUrl) {
      URL.revokeObjectURL(qrCodeUrl);
      setQrCodeUrl(null);
    }
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
        type: 'TreeSelect',
        name: 'orgId',
        label: 'Đại lý',
        placeholder: 'Đại lý',
        treeData: agencyOptions,
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
  }, [activeStatusOptions, agencyOptions, packageOptions, subStatusOptions]);

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
    exportComponent,
  };
};
