import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./page'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.serialLookup,
    page: <Page />,
  },
];

export default routes;
