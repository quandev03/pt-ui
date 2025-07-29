
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
const Page = lazy(() => import('./components/ModalAddEditView'));
const PackageAuthorizationRoutes: RouterConfig[] = [
  {
    path: pathRoutes.packageAuthorization(),
    page: <Page />,
  },
];

export default PackageAuthorizationRoutes;
