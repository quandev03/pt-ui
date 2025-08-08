import { RouteObject } from 'react-router-dom';
import routesWelcome from '../modules/WelcomePage/routes';
import { routesUserManagement } from '../modules/UserManagement/routes';
import { routesAgencyList } from '../modules/AgencyList/routes';
import freeEsimBookingRoutes from '../modules/ESimBooking/FreeESimBooking/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...routesUserManagement,
  ...routesAgencyList,
  ...freeEsimBookingRoutes,
];
