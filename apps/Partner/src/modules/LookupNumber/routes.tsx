import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./page'));

const routesLookupNumber: RouterConfig[] = [
  {
    path: pathRoutes.lookupNumber,
    page: <Page />,
  },
];
export default routesLookupNumber;
