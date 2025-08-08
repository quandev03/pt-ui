import { IModeAction } from '@vissoft-react/common';
import useConfigAppStore from '../modules/Layouts/stores';
import { useLocation } from 'react-router-dom';

export const useRolesByRouter = (path?: string) => {
  const { menuData } = useConfigAppStore();
  const location = useLocation();
  const pathname = location.pathname;

  const actions: IModeAction[] =
    menuData.filter((item) => (path ?? pathname).includes(item?.uri ?? ''))?.[0]
      ?.actions || [];

  return actions;
};
