import { MenuObjectItem } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { useLocation } from 'react-router-dom';
import { REACT_QUERY_KEYS } from '../constants/querykeys';

export const useRolesByRouter = () => {
  const flatMenu = useGetDataFromQueryKey<MenuObjectItem[]>([
    REACT_QUERY_KEYS.GET_MENU,
  ]);
  const location = useLocation();
  const pathname = location.pathname;
  const actions: ActionsTypeEnum[] = flatMenu?.filter((item) =>
    pathname.includes(item?.uri ?? '')
  )?.[0]?.actions;
  return actions || [];
};
