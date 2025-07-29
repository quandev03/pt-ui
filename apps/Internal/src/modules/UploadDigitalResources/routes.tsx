import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ActionType } from '@react/constants/app';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageView = lazy(() => import('./page/add'));
const routes: RouterConfig[] = [
  // {
  //     path: pathRoutes.upload_digital_resources,
  //     page: <Page />,
  // },
  // {
  //     path: pathRoutes.upload_digital_resources_add,
  //     page: <PageAdd type={ActionType.ADD} />,
  // },
  // {
  //     path: pathRoutes.upload_digital_resources_view(),
  //     page: <PageView type={ActionType.VIEW} />,
  // },
];

export default routes;
