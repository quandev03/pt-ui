import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ACTION_MODE_ENUM } from '@react/commons/types';
const ObjectPage = lazy(() => import('./pages'));
const AddEditViewPage = lazy(() => import('./pages/AddEditView'));

const objectRoutes: RouterConfig[] = [
  {
    path: pathRoutes.object,
    page: <ObjectPage />,
  },
  {
    path: pathRoutes.object_add,
    page: <AddEditViewPage actionMode={ACTION_MODE_ENUM.CREATE} />,
  },
  {
    path: pathRoutes.object_edit(),
    page: <AddEditViewPage actionMode={ACTION_MODE_ENUM.EDIT} />,
  },
  {
    path: pathRoutes.object_view(),
    page: <AddEditViewPage actionMode={ACTION_MODE_ENUM.VIEW} />,
  },
];

export default objectRoutes;
