import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./pages/index'));

const routes: RouterConfig[] = [
    {
        path: pathRoutes.managePartnerAirtimeAccount,
        page: <Page />,
    },
];

export default routes;
