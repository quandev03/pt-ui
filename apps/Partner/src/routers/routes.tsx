import { RouteObject } from 'react-router-dom';
import { routesAgencyList } from '../modules/AgencyList/routes';
import freeEsimBookingRoutes from '../modules/ESimBooking/FreeESimBooking/routes';
import routesDashboard from '../modules/Dashboard/routes';
import { routesUpdateSubscriberInfo } from '../modules/UpdateSubscriberInfo/routes';
import buyBundleWithEsimRoutes from '../modules/ESimBooking/BuyBundleWithEsim/routes';
import { eSimWareHouseRoutes } from '../modules/EsimWarehouse/routes';
import { roomServiceRoutes } from '../modules/RoomService/routes';
import { roomPaymentRoutes } from '../modules/RoomPayment/routes';
import routesPersonalInfo from '../modules/PersonalInfo/routes';
import { routesUserManagement } from '../modules/UserManagement/routes';
import routesWelcome from '../modules/WelcomePage/routes';
import partnerOrderReportRoutes from '../modules/PartnerOrderReport/routes';
import { routesPackageSaleList } from '../modules/SalePackage/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...routesPackageSaleList,
  ...eSimWareHouseRoutes,
  ...roomServiceRoutes,
  ...roomPaymentRoutes,
  ...routesUserManagement,
  ...routesAgencyList,
  ...freeEsimBookingRoutes,
  ...routesDashboard,
  ...routesUpdateSubscriberInfo,
  ...buyBundleWithEsimRoutes,
  ...routesPersonalInfo,
  ...partnerOrderReportRoutes,
];
