import { ActionType } from '@react/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));

const routes: RouterConfig[] = [
    {
        path: pathRoutes.internalImportExportWarehouse,
        page: <Page />,
    },
    {
        path: pathRoutes.internalImportWarehouseAdd,
        page: <PageAdd isImport={true} typeModal={ActionType.ADD} />,
    },
    {
        path: pathRoutes.internalExportWarehouseAdd,
        page: <PageAdd isImport={false} typeModal={ActionType.ADD} />,
    },
    {
        path: pathRoutes.internalImportWarehouseView(),
        page: <PageAdd isImport={true} typeModal={ActionType.VIEW} />,
    },
    {
        path: pathRoutes.internalExportWarehouseView(),
        page: <PageAdd isImport={false} typeModal={ActionType.VIEW} />,
    }
];

export default routes;
