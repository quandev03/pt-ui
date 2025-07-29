import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const Page = lazy(() => import('./page'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.reportCriteria,
    page: <Page />,
  },
];
export default routes;
