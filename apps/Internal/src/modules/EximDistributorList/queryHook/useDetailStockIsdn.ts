import { prefixCatalogService } from "@react/url/app"
import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"

const fetcher = (id: string) => {
  return axiosClient.get(`${prefixCatalogService}/organization-unit/${id}`)
}

export const useDetailStockIsdn = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const responses = await Promise.all(ids.map(id => fetcher(id)));
      return responses
    },
  });
}
