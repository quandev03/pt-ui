import { useMutation } from "@tanstack/react-query"
import { prefixAuthServicePublic } from "apps/Partner/src/constants/app"
import { axiosClient } from "apps/Partner/src/service"

const fetcher = () => {
  return axiosClient.delete(`${prefixAuthServicePublic}/api/auth/signature`)
}

export const useDeleteSignature = () => {
  return useMutation({
    mutationFn: fetcher
  })
}
