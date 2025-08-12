import { RouteObject } from 'react-router-dom';
import { routesAgencyList } from '../modules/AgencyList/routes';
import { routesUserManagement } from '../modules/UserManagement/routes';
import routesWelcome from '../modules/WelcomePage/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...routesUserManagement,
  ...routesAgencyList,
];
