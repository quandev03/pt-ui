import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const ShippingConfigurationsPage = lazy(() => import('./pages'));

const shippingConfigurationsRoutes: RouterConfig[] = [
  {
    path: pathRoutes.shippingConfigurations,
    page: <ShippingConfigurationsPage />,
  },
];

export default shippingConfigurationsRoutes;
