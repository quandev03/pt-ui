import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { axiosClient } from 'apps/Partner/src/service';
import { NotificationSuccess } from '@react/commons/Notification';
import { useNavigate } from 'react-router-dom';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { MESSAGE } from '@react/utils/message';
import {  prefixCatalogServicePublic } from '@react/url/app';

const deleteApi = (id: string) => {
  return axiosClient.delete<any>(
    `${prefixCatalogServicePublic}/organization-unit` + `/${id}`
  );
};

export const useDeleteFn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_DEPARTMENT],
      });
      NotificationSuccess(MESSAGE.G03);
      navigate(pathRoutes.warehouseManagement);
    },
  });
};
