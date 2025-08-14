import { isPageReload } from '@vissoft-react/common';
import { isEmpty } from 'lodash';
import { createHashRouter, ShouldRevalidateFunction } from 'react-router-dom';
import { ErrorPage, NotFoundPage } from '../modules/Errors/index';
import useConfigAppStore from '../modules/Layouts/stores';
import { globalService } from '../services';
import { protectedRoutes } from './routes';
import { pathRoutes } from './url';
import ForgotPassword from '../modules/Auth/pages/ForgotPassword';

const mainRouterShouldRevalidate: ShouldRevalidateFunction = () => {
  return false;
};

const LOADER_INIT_KEY = 'LOADER_INIT_KEY';

export const routers = createHashRouter([
  {
    path: pathRoutes.home as string,
    loader: async () => {
      // Kiểm tra nếu không phải page reload và đã có data trong store
      if (!isPageReload()) {
        const { userLogin, menuData } = useConfigAppStore.getState();
        if (!isEmpty(userLogin) && !isEmpty(menuData)) {
          return {
            profile: userLogin,
            menus: menuData,
          };
        }
      }
      const result = await globalService.initApp();
      useConfigAppStore.getState().setInitApp(result);
      return result;
    },
    lazy: async () => {
      const { LayoutPage } = await import('../modules/Layouts/pages');
      return {
        element: <LayoutPage />,
      };
    },
    shouldRevalidate: mainRouterShouldRevalidate,
    errorElement: <ErrorPage />,
    children: [...protectedRoutes],
  },
  {
    path: pathRoutes.login as string,
    lazy: async () => {
      const { default: Login } = await import('../modules/Auth/pages/Login');
      return {
        element: <Login />,
      };
    },
    loader: () => {
      localStorage.removeItem(LOADER_INIT_KEY);
      return null;
    },
    errorElement: <ErrorPage />,
  },
  {
    path: pathRoutes.forgotPassword as string,
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: pathRoutes.notFound as string,
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
