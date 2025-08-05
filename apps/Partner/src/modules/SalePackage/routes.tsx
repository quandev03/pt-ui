import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const routesPackageSaleList: RouteObject[] = [
  {
    path: pathRoutes.salePackage,
    lazy: async () => {
      const { PackageSaleList } = await import('./pages');
      return { Component: PackageSaleList };
    },
  },
];
