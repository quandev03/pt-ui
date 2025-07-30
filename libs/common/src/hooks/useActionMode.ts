import { IModeAction } from '../types';
import { useLocation } from 'react-router-dom';

export const useActionMode = () => {
  const { pathname } = useLocation();
  const pathnameArray = pathname.split('/');
  const checkPathname = (path: string) =>
    pathnameArray.some((item) => item === path);

  if (checkPathname('view')) {
    return IModeAction.READ;
  } else if (checkPathname('add')) {
    return IModeAction.CREATE;
  } else if (checkPathname('edit')) {
    return IModeAction.UPDATE;
  } else {
    return IModeAction.READ;
  }
};
