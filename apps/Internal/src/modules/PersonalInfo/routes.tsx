import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
const PersonalInfoPage = lazy(() => import('./pages/index'));

const personalInfoRoutes: RouterConfig[] = [
  {
    path: pathRoutes.profile,
    page: <PersonalInfoPage />,
  },
];

export default personalInfoRoutes;
