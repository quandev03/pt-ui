import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ActionType } from '@react/constants/app';

const KitAddView = lazy(() => import('./pages/KitAddView'));
const KitGroupAddView = lazy(() => import('./pages/KitGroupAddView'));
const KitCraft = lazy(() => import('./pages/index'));
const KitCraftList = lazy(() => import('./pages/KitCraftList'));

const kitCraftRoutes: RouterConfig[] = [
  {
    path: pathRoutes.kitCraft,
    page: <KitCraft />,
  },
  {
    path: pathRoutes.kitCraftList,
    page: <KitCraftList />,
  },
  {
    path: pathRoutes.kitCraftSingle,
    page: <KitAddView actionType={ActionType.ADD} />,
  },
  {
    path: pathRoutes.kitCraftView(),
    page: <KitAddView actionType={ActionType.VIEW} />,
  },
  {
    path: pathRoutes.kitCraftBatch,
    page: <KitGroupAddView actionType={ActionType.ADD} />,
  },
  {
    path: pathRoutes.kitCraftGroupView(),
    page: <KitGroupAddView actionType={ActionType.VIEW} />,
  },
];

export default kitCraftRoutes;
