import { ActionType } from '@react/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));

const routes: RouterConfig[] = [
    {
        path: pathRoutes.internalWarehouseDeliveryNote,
        page: <Page />,
    },
    {
        path: pathRoutes.internalExportWarehouseDeliveryNoteAdd,
        page: <PageAdd typeModal={ActionType.ADD} />,
    },
    {
        path: pathRoutes.internalWarehouseDeliveryNoteView(),
        page: <PageAdd typeModal={ActionType.VIEW} />,
    }
];

export default routes;
