import { ParamsOption } from '@react/commons/types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { DELIVERY_ORDER_ORDER_STATUS } from '../components/Header';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

export const useGetLabelStatus = () => {
  const { DELIVERY_ORDER_APPROVAL_STATUS } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const getLabelStatusApproval = (value: number) => {
    return DELIVERY_ORDER_APPROVAL_STATUS.find(
      (item) => String(item.value) === String(value)
    )?.label;
  };
  const getLabelStatusOrder = (value: number) => {
    return DELIVERY_ORDER_ORDER_STATUS.find(
      (item) => String(item.value) === String(value)
    )?.label;
  };
  return {
    getLabelStatusApproval,
    getLabelStatusOrder,
  };
};
