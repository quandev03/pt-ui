import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

const roleRoutes: RouteObject[] = [
  {
    path: pathRoutes.roleManager,
    lazy: async () => {
      const { ListRole } = await import('./page/ListRole');
      return { Component: () => <ListRole isPartner={false} /> };
    },
  },
  {
    path: pathRoutes.roleManagerAdd,
    lazy: async () => {
      const { ActionRole } = await import('./page');
      return { Component: () => <ActionRole isPartner={false} /> };
    },
  },
  {
    path: pathRoutes.roleManagerEdit(),
    lazy: async () => {
      const { ActionRole } = await import('./page');
      return { Component: () => <ActionRole isPartner={false} /> };
    },
  },
  {
    path: pathRoutes.roleManagerView(),
    lazy: async () => {
      const { ActionRole } = await import('./page');
      return { Component: () => <ActionRole isPartner={false} /> };
    },
  },
  {
    path: pathRoutes.rolePartnerManager,
    lazy: async () => {
      const { ListRole } = await import('./page');
      return { Component: () => <ListRole isPartner={true} /> };
    },
  },
  {
    path: pathRoutes.rolePartnerManagerAdd,
    lazy: async () => {
      const { ActionRole } = await import('./page');
      return { Component: () => <ActionRole isPartner={true} /> };
    },
  },
  {
    path: pathRoutes.rolePartnerManagerEdit(),
    lazy: async () => {
      const { ActionRole } = await import('./page');
      return { Component: () => <ActionRole isPartner={true} /> };
    },
  },
  {
    path: pathRoutes.rolePartnerManagerView(),
    lazy: async () => {
      const { ActionRole } = await import('./page');
      return { Component: () => <ActionRole isPartner={true} /> };
    },
  },
];

export default roleRoutes;
