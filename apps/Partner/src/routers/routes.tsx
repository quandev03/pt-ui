import { RouteObject } from 'react-router-dom';
import routesWelcome from '../modules/WelcomePage/routes';
import freeEsimBookingRoutes from '../modules/ESimBooking/FreeESimBooking/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...freeEsimBookingRoutes,
];
