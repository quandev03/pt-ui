import { IModeAction } from '@vissoft-react/common';
import { useLocation } from 'react-router-dom';

const useActionMode = () => {
  const { pathname } = useLocation();
  if (pathname.includes('view')) {
    return IModeAction.READ;
  } else if (pathname.includes('add')) {
    return IModeAction.CREATE;
  } else if (pathname.includes('edit')) {
    return IModeAction.UPDATE;
  } else {
    return IModeAction.CREATE;
  }
};

export default useActionMode;
