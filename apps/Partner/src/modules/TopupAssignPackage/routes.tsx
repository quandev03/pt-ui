import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./components/ModalAdd'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.topupAssignPackage,
    page: <Page />,
  },
  {
    path: pathRoutes.topupAssignPackageAdd,
    page: <PageAdd />,
  },
];

export default routes;
