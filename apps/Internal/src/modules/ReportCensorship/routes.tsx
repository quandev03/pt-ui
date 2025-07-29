import { lazy } from 'react';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
const Page = lazy(() => import('./page'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.reportCensorship,
    page: <Page />,
  },
];
export default routes;
