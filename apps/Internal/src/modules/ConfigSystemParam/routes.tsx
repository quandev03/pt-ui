import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ACTION_MODE_ENUM } from '@react/commons/types';
const ConfigSystemParamPage = lazy(() => import('./pages'));
const AddEditViewPage = lazy(() => import('./pages/AddEditView'));

const configSystemParamRoutes: RouterConfig[] = [
  {
    path: pathRoutes.configSystemParamList,
    page: <ConfigSystemParamPage />,
  },
  {
    path: pathRoutes.configSystemParamAdd,
    page: <AddEditViewPage actionMode={ACTION_MODE_ENUM.CREATE} />,
  },
  {
    path: pathRoutes.configSystemParamEdit(),
    page: <AddEditViewPage actionMode={ACTION_MODE_ENUM.EDIT} />,
  },
  {
    path: pathRoutes.configSystemParamView(),
    page: <AddEditViewPage actionMode={ACTION_MODE_ENUM.VIEW} />,
  },
];

export default configSystemParamRoutes;
