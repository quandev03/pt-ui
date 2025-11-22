import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const roomServiceRoutes: RouteObject[] = [
  {
    path: pathRoutes.roomService,
    lazy: async () => {
      const { ListRoomService } = await import('./pages/ListRoomService');
      return { Component: ListRoomService };
    },
  },
  {
    path: pathRoutes.roomServiceView(),
    lazy: async () => {
      const { RoomServiceAction } = await import('./pages/RoomServiceAction');
      return { Component: RoomServiceAction };
    },
  },
  {
    path: pathRoutes.roomServiceEdit(),
    lazy: async () => {
      const { RoomServiceAction } = await import('./pages/RoomServiceAction');
      return { Component: RoomServiceAction };
    },
  },
  {
    path: pathRoutes.roomServiceAdd,
    lazy: async () => {
      const { RoomServiceAction } = await import('./pages/RoomServiceAction');
      return { Component: RoomServiceAction };
    },
  },
];

