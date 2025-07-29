import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.areaCatalog,
    page: <Page />,
  },
];

export default routes;
