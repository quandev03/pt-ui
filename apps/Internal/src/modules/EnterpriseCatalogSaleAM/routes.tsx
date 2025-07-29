import { lazy } from 'react';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import AddSalePage from './components/ModalAddEditView'
import { ActionType } from '@react/constants/app';

const Page = lazy(() => import('./page'));
const PageAddSale = lazy(() => import('./components/ModalAddEditView'));
const PageAddAM = lazy(() => import('./components/ModalAddAM'));
// const PageEdit = lazy(() => import('./page/edit'));
// const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.catalogSaleandAM,
    page: <Page />,
  },
  {
    path: pathRoutes.catalogSaleAMAddSale,
    page: <PageAddSale actionType={ActionType.ADD} />,
  },
  {
    path: pathRoutes.catalogSaleAMAddAM,
    page: <PageAddAM actionType={ActionType.ADD} />,
  },
  // {
  //   path: pathRoutes.activationRequestListView(),
  //   page: <PageView />,
  // },
];

export default routes;
