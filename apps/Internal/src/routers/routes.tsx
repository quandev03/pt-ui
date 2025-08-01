import { RouteObject } from 'react-router-dom';
import routesWelcome from '../modules/WelcomePage/routes';
import { routesUserManagement } from '../modules/UserManagement/routes';
import routesObjectManagement from '../modules/ObjectManagement/routes';
import routesLookupNumber from '../modules/LookupNumber/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...routesUserManagement,
  ...routesObjectManagement,
  ...routesLookupNumber,
];
