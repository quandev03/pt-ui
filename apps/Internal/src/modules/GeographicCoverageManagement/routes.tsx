import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const ListCoverageArea = lazy(() => import('./page/ListCoverageArea'));
const ActionCoverageArea = lazy(() => import('./page/ActionCoverageArea'));

const coverageAreaRoutes: RouterConfig[] = [
  {
    path: pathRoutes.coverageAreaManager,
    page: <ListCoverageArea />,
  },
  {
    path: pathRoutes.coverageAreaManagerAdd,
    page: <ActionCoverageArea />,
  },
  {
    path: pathRoutes.coverageAreaManagerView(),
    page: <ActionCoverageArea />,
  },
  {
    path: pathRoutes.coverageAreaManagerEdit(),
    page: <ActionCoverageArea />,
  },
];

export default coverageAreaRoutes;
