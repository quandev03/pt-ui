import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';
import { ActionType } from '@react/constants/app';
const Page = lazy(() => import('./pages'));
const PageAdd = lazy(() => import('./components/ModalAddViewEdit'));
const routes: RouterConfig[] = [
    {
        path: pathRoutes.promotionProgramBusiness,
        page: <Page />,
    },
    {
        path: pathRoutes.promotionProgramBusinessAdd,
        page: <PageAdd typeModal={ActionType.ADD} />,
    },
    {
        path: pathRoutes.promotionProgramBusinessView(),
        page: <PageAdd typeModal={ActionType.VIEW} />,
    },
    {
        path: pathRoutes.promotionProgramBusinessEdit(),
        page: <PageAdd typeModal={ActionType.EDIT} />,
    },
]
export default routes;