import { useMutation } from '@tanstack/react-query';
import { UpdateSubscriberInfo } from '../services';
import { AnyElement } from '@vissoft-react/common';

export const useCheckIsdn = (
  onSuccess?: (data: AnyElement) => void,
  onError?: () => void
) => {
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
