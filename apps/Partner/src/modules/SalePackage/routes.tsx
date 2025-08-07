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
  {
    path: pathRoutes.salePackageAddSingle,
    lazy: async () => {
      const { SingleSalePackageAction } = await import('./pages');
      return { Component: SingleSalePackageAction };
    },
  },
  {
    path: pathRoutes.salePackageAddBulk,
    lazy: async () => {
      const { BulkSalePackageAction } = await import('./pages');
      return { Component: BulkSalePackageAction };
    },
  },
];
