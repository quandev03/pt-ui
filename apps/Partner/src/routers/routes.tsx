import { RouteObject } from 'react-router-dom';
import routesWelcome from '../modules/WelcomePage/routes';
import { routesUserManagement } from '../modules/UserManagement/routes';
import { routesAgencyList } from '../modules/AgencyList/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...routesUserManagement,
  ...routesAgencyList,
];
