import { ActionType } from '@react/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageView = lazy(() => import('./page/view'));
const routes: RouterConfig[] = [
    {
        path: pathRoutes.internalExportProposalReceive,
        page: <Page />,
    },
    {
        path: pathRoutes.internalExportProposalReceiveView(),
        page: <PageView typeModal={ActionType.VIEW} />,
    },
];

export default routes;
