import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import useConfigAppStore from '../components/layouts/store';
import { pathRoutes } from '../constants/routes';
import StorageService from '../helpers/storageService';

export interface RouterConfig {
  path: string;
  page: ReactNode;
}
const ProtectedRoute = ({ element }: { element: ReactNode }) => {
  const { isAuthenticated } = useConfigAppStore();
  const token = StorageService.getAccessToken();
  if (!isAuthenticated || !token) {
    return <Navigate to={pathRoutes.login} replace={true} />;
  }
  return <MainLayout>{element}</MainLayout>;
};
export default ProtectedRoute;
