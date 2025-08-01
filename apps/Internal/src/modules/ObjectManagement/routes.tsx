import { lazy } from 'react';
import { pathRoutes } from '../../routers';
import { RouteObject } from 'react-router-dom';

const objectRoutes: RouteObject[] = [
  {
    path: pathRoutes.object,
    lazy: async () => {
      const { ListPage } = await import('./pages/ListPage');
      return { Component: ListPage };
    },
  },
  {
    path: pathRoutes.object_add,
    lazy: async () => {
      const { AddEditView } = await import('./pages/AddEditView');
      return { Component: AddEditView };
    },
  },
  {
    path: pathRoutes.object_edit(),
    lazy: async () => {
      const { AddEditView } = await import('./pages/AddEditView');
      return { Component: AddEditView };
    },
  },
  {
    path: pathRoutes.object_view(),
    lazy: async () => {
      const { AddEditView } = await import('./pages/AddEditView');
      return { Component: AddEditView };
    },
  },
];

export default objectRoutes;
