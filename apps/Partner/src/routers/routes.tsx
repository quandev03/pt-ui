import { RouteObject } from 'react-router-dom';
import routesWelcome from '../modules/WelcomePage/routes';
import { routesUpdateSubscriberInfo } from '../modules/UpdateSubscriberInfo/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...routesUpdateSubscriberInfo,
];
