import { RouteObject } from 'react-router-dom';
import { routesAgencyList } from '../modules/AgencyList/routes';
import freeEsimBookingRoutes from '../modules/ESimBooking/FreeESimBooking/routes';
import routesDashboard from '../modules/Dashboard/routes';
import { routesUpdateSubscriberInfo } from '../modules/UpdateSubscriberInfo/routes';
import buyBundleWithEsimRoutes from '../modules/ESimBooking/BuyBundleWithEsim/routes';
import { eSimWareHouseRoutes } from '../modules/EsimWarehouse/routes';
import { routesUserManagement } from '../modules/UserManagement/routes';
import routesWelcome from '../modules/WelcomePage/routes';
import partnerOrderReportRoutes from '../modules/PartnerOrderReport/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...eSimWareHouseRoutes,
  ...routesUserManagement,
  ...routesAgencyList,
  ...freeEsimBookingRoutes,
  ...routesDashboard,
  ...routesUpdateSubscriberInfo,
  ...buyBundleWithEsimRoutes,
  ...partnerOrderReportRoutes,
];
