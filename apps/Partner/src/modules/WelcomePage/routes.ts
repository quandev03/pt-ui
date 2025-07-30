import { pathRoutes } from '../../routers/url';
import { RouteObject } from 'react-router-dom';

const routesWelcome: RouteObject[] = [
  {
    path: pathRoutes.welcome as string,
    lazy: async () => {
      const { default: WelcomePage } = await import('./');
      return { Component: WelcomePage };
    },
  },
];

export default routesWelcome;
