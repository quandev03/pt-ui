import { ACTION_MODE_ENUM } from '@react/commons/types';
import { useLocation } from 'react-router-dom';

const useActionMode = () => {
  const { pathname } = useLocation();
  if (pathname.includes('view')) {
    return ACTION_MODE_ENUM.VIEW;
  } else if (pathname.includes('add')) {
    return ACTION_MODE_ENUM.CREATE;
  } else if (pathname.includes('edit')) {
    return ACTION_MODE_ENUM.EDIT;
  } else if (pathname.includes('copy')) {
    return ACTION_MODE_ENUM.Copy;
  } else {
    return ACTION_MODE_ENUM.CREATE;
  }
};

export default useActionMode;
