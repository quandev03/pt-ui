import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const Page = lazy(() => import('./page'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.reportActivate,
    page: <Page />,
  },
];
export default routes;
