import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import {ACTION_MODE_ENUM} from "@react/commons/types";
const ConfigApprovalPage = lazy(() => import('./pages'));
const AddEditViewPage = lazy(() => import('./pages/AddEditView'));

const configApprovalRoutes: RouterConfig[] = [
  {
    path: pathRoutes.config_approval,
    page: <ConfigApprovalPage />,
  },
  {
    path: pathRoutes.config_approval_add,
    page: <AddEditViewPage actionMode={ACTION_MODE_ENUM.CREATE} />,
  },
  {
    path: pathRoutes.config_approval_edit(),
    page: <AddEditViewPage actionMode={ACTION_MODE_ENUM.EDIT} />,
  },
  {
    path: pathRoutes.config_approval_view(),
    page: <AddEditViewPage actionMode={ACTION_MODE_ENUM.VIEW} />,
  },
];

export default configApprovalRoutes;
