import { RouteObject } from 'react-router-dom';
import routesWelcome from '../modules/WelcomePage/routes';
import { routesUserManagement } from '../modules/UserManagement/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...routesUserManagement,
];
