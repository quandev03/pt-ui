import { ActionType } from '@react/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));

const routes: RouterConfig[] = [
    {
        path: pathRoutes.phoneNoCatalog,
        page: <Page />,
    },
    {
        path: pathRoutes.phoneNoCatalogAdd,
        page: <PageAdd typeModal={ActionType.ADD} />,
    },
    {
        path: pathRoutes.phoneNoCatalogView(),
        page: <PageAdd typeModal={ActionType.VIEW} />,
    },
    {
        path: pathRoutes.phoneNoCatalogEdit(),
        page: <PageAdd typeModal={ActionType.EDIT} />,
    }
];

export default routes;
