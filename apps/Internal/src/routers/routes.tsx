import { RouteObject } from 'react-router-dom';
import routesWelcome from '../modules/WelcomePage/routes';
import { routesUserManagement } from '../modules/UserManagement/routes';
import routesObjectManagement from '../modules/ObjectManagement/routes';
import routesLookupNumber from '../modules/LookupNumber/routes';
import routesListOfServicePackage from '../modules/ListOfServicePackage/routes';
import routesDashboard from '../modules/Dashboard/routes';
import routesRoleManagement from '../modules/RoleManagement/routes';
import routesUserGroupManagement from '../modules/UserGroupManagement/routes';
import routesESIMStock from '../modules/eSIMStock/routes';
import { routesReportPartner } from '../modules/ReportPartner/routes';

export const protectedRoutes: RouteObject[] = [
  ...routesWelcome,
  ...routesUserManagement,
  ...routesObjectManagement,
  ...routesLookupNumber,
  ...routesListOfServicePackage,
  ...routesRoleManagement,
  ...routesUserGroupManagement,
  ...routesDashboard,
  ...routesESIMStock,
  ...routesReportPartner,
];
