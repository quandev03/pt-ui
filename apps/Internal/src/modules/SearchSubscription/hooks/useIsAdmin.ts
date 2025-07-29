import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useLocation } from 'react-router-dom';

export const useIsAdmin = () => {
  const { pathname } = useLocation();
  const ps = pathname.split('/');
  const isAdmin = `/${ps[1]}` === pathRoutes.searchSubscription;

  return isAdmin;
};
