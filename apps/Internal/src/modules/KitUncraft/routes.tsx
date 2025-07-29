import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ActionType } from '@react/constants/app';

const AddItem = lazy(() => import('./pages/AddItem'));
const KitUncraft = lazy(() => import('./pages/index'));

const kitUncraftRoutes: RouterConfig[] = [
  {
    path: pathRoutes.kitUncraft,
    page: <KitUncraft />,
  },
  {
    path: pathRoutes.kitUncraftAdd,
    page: <AddItem actionType={ActionType.ADD} />,
  },
];

export default kitUncraftRoutes;
