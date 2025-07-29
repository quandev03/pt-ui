import { ActionType } from '@react/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));

const routes: RouterConfig[] = [
    {
        path: pathRoutes.internalExportProposal,
        page: <Page />,
    },
    {
        path: pathRoutes.internalExportProposalAdd,
        page: <PageAdd actionType={ActionType.ADD} />,
    },
    {
        path: pathRoutes.internalExportProposalView(),
        page: <PageAdd actionType={ActionType.VIEW} />,
    },
    {
        path: pathRoutes.internalExportProposalCopy(),
        page: <PageAdd actionType={ActionType.EDIT} />,
    }
];

export default routes;
