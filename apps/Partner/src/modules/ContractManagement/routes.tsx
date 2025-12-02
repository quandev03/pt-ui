import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const contractManagementRoutes: RouteObject[] = [
  {
    path: pathRoutes.contractManagement,
    lazy: async () => {
      const { ListContract } = await import('./pages/ListContract');
      return { Component: ListContract };
    },
  },
  {
    path: pathRoutes.contractManagementAdd,
    lazy: async () => {
      const { AddContract } = await import('./pages/AddContract');
      return { Component: AddContract };
    },
  },
  {
    path: pathRoutes.contractManagementDetail(),
    lazy: async () => {
      const { ContractDetail } = await import('./pages/ContractDetail');
      return { Component: ContractDetail };
    },
  },
];


