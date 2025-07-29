import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./pages'));
const configurationManagementRoutes: RouterConfig[] = [
  {
    path: pathRoutes.configurationManagement,
    page: <Page />,
  },
];
export default configurationManagementRoutes;
