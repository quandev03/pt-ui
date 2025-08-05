import { RouteObject } from 'react-router-dom';
import routesWelcome from '../modules/WelcomePage/routes';
import { routesPackageSaleList } from '../modules/SalePackage/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...routesPackageSaleList,
];
