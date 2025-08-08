import { pathRoutes } from '../../../routers/url';
import { RouteObject } from 'react-router-dom';

const buyBundleWithEsimRoutes: RouteObject[] = [
  {
    path: pathRoutes.buyBundleWithEsim,
    lazy: async () => {
      const { ListPackagedEsim } = await import('./pages');
      return { Component: ListPackagedEsim };
    },
  },
  {
    path: pathRoutes.buyBundleWithEsimAdd,
    lazy: async () => {
      const { ActionPackagedESim } = await import('./pages');
      return { Component: ActionPackagedESim };
    },
  },
  {
    path: pathRoutes.buyBundleWithEsimView(),
    lazy: async () => {
      const { ActionPackagedESim } = await import('./pages');
      return { Component: ActionPackagedESim };
    },
  },
];

export default buyBundleWithEsimRoutes;
