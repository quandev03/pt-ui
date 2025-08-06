import { RouteObject } from 'react-router-dom';
import routesWelcome from '../modules/WelcomePage/routes';
import { eSimWareHouseRoutes } from '../modules/EsimWarehouse/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...eSimWareHouseRoutes,
];
