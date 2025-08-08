import { useMutation } from '@tanstack/react-query';
import { AnyElement } from '@vissoft-react/common';
import { UpdateSubscriberInfo } from '../services';
import { useUpdateSubscriberInfoStore } from '../store';

export const useCheckIsdn = (onSuccess?: (data: AnyElement) => void) => {
  return useMutation({
    mutationFn: UpdateSubscriberInfo.checkIsdn,
    onSuccess(data) {
      if (onSuccess) onSuccess(data);
    },
  });
};
export const useCheckOcr = (onSuccess?: (data: AnyElement) => void) => {
  return useMutation({
    mutationFn: UpdateSubscriberInfo.ocr,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });
};
export const useCheckFace = (onSuccess?: (data: AnyElement) => void) => {
  return useMutation({
    mutationFn: UpdateSubscriberInfo.faceCheck,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });
};
export const useGetPreviewConfirmContract = (
  onSuccess?: (data: string) => void
) => {
  const { setContractUrl } = useUpdateSubscriberInfoStore();
  return useMutation({
    mutationFn: UpdateSubscriberInfo.previewConfirmContract,
    onSuccess(data) {
      setContractUrl(data);
      onSuccess?.(data);
    },
  });
};
export const useGetPreviewND13 = (onSuccess?: (data: string) => void) => {
  return useMutation({
    mutationFn: UpdateSubscriberInfo.previewND13,
    onSuccess(data) {
      onSuccess?.(data);
    },
  });
};
export const useGenContract = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: UpdateSubscriberInfo.gencontract,
    onSuccess: () => {
      onSuccess?.();
      // const link = `${baseSignUrl || window.location.origin}/#/`;
      // form.setFieldValue('signLink', link);
      // window.open(link, '_blank', 'top=200,left=500,width=600,height=600');
      // form.setFieldValue('contractId', id);
      // const interval = setInterval(() => {
      //   mutateSigningChecker({
      //     contractId: id,
      //     key: TypePDF.HD,
      //     timeStampContract,
      //   });
      // }, 5000);
      // if (isSignSuccess) {
      //   clearInterval(interval);
      // } else {
      //   setIntervalApi(interval);
      // }
    },
  });
};
