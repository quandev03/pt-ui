import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetContractDetail } from '../../hooks';
import { NotificationError } from '@vissoft-react/common';
import { useGetAgencyOptions } from '../../../../hooks/useGetAgencyOptions';
import { contractManagementServices } from '../../services';

export const useLogicContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: contractDetail, isLoading: loadingDetail } =
    useGetContractDetail(id);
  const { data: agencyOptions = [] } = useGetAgencyOptions();
  const [contractPdfBlobUrl, setContractPdfBlobUrl] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handlePrintContract = useCallback(() => {
    const contractPath = contractDetail?.contractPdfUrl || contractDetail?.contractFileUrl;
    if (!contractPath) {
      NotificationError({
        message: 'Không có file hợp đồng để in',
      });
      return;
    }
    const downloadUrl = contractManagementServices.getDownloadUrl(contractPath);
    window.open(downloadUrl, '_blank');
  }, [contractDetail]);

  const getDownloadUrl = useCallback((filePath: string | undefined) => {
    if (!filePath) return '';
    return contractManagementServices.getDownloadUrl(filePath);
  }, []);

  const findRoomName = (orgUnitId: string): string => {
    const findInTree = (nodes: any[]): string | null => {
      for (const node of nodes) {
        if (node.value === orgUnitId) {
          return node.title;
        }
        if (node.children) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(agencyOptions) || '-';
  };

  // Load PDF file as blob để hiển thị trong iframe
  useEffect(() => {
    const loadContractPdf = async () => {
      const contractPath = contractDetail?.contractPdfUrl || contractDetail?.contractFileUrl;
      if (!contractPath) {
        setContractPdfBlobUrl(null);
        return;
      }

      try {
        const blob = await contractManagementServices.downloadFileAsBlob(contractPath);
        const blobUrl = URL.createObjectURL(blob);
        setContractPdfBlobUrl(blobUrl);
      } catch (error) {
        console.error('Error loading contract PDF:', error);
        NotificationError({ message: 'Không thể tải file hợp đồng' });
        setContractPdfBlobUrl(null);
      }
    };

    if (contractDetail) {
      loadContractPdf();
    }

    // Cleanup: revoke blob URL khi component unmount hoặc contractDetail thay đổi
    return () => {
      if (contractPdfBlobUrl) {
        URL.revokeObjectURL(contractPdfBlobUrl);
      }
    };
  }, [contractDetail]);

  return {
    contractDetail,
    loadingDetail,
    handleClose,
    handlePrintContract,
    findRoomName,
    getDownloadUrl,
    contractPdfBlobUrl,
  };
};

