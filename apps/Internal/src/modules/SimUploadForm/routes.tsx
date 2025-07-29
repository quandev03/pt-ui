import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const UploadSimList = lazy(() => import('./page/UploadFormList'));
const ActionUploadForm = lazy(() => import('./page/ActionUploadForm'));
const uploadSimFormRoutes: RouterConfig[] = [
  {
    path: pathRoutes.uploadSimForm,
    page: <UploadSimList />,
  },
  {
    path: pathRoutes.addUploadSimForm,
    page: <ActionUploadForm />,
  },
  {
    path: pathRoutes.viewUploadSimForm(),
    page: <ActionUploadForm />,
  },
];
export default uploadSimFormRoutes;
