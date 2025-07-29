import { useMutation } from "@tanstack/react-query";
import { prefixAuthServicePublic } from "apps/Partner/src/constants/app";
import { axiosClient } from "apps/Partner/src/service"

interface Res {
  data: { contractId: string };
}

export const queryKeySignature = 'query-edit-signature-personal';

const fetcher = (signature: Blob) => {
  const formData = new FormData()
  formData.append('image', signature)
  return axiosClient.patch<any, Res>(
    `${prefixAuthServicePublic}/api/auth/signature`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

export const useEditSignature = () => {
  return useMutation({
    mutationKey: [queryKeySignature],
    mutationFn: fetcher
  })
}
