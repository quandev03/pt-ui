import { isPageReload } from '@vissoft-react/common';
import { isEmpty } from 'lodash';
import {
  createBrowserRouter,
  redirect,
  ShouldRevalidateFunction,
} from 'react-router-dom';
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

export const routers = createBrowserRouter([
  {
    path: pathRoutes.home as string,
    loader: async () => {
      console.log('🚀 ~ Router loader called');
      
      // Kiểm tra authentication trước
      const { isAuthenticated } = useConfigAppStore.getState();
      const { StorageService } = await import('@vissoft-react/common');
      const { ACCESS_TOKEN_KEY } = await import('../constants');
      const token = StorageService.getAccessToken(ACCESS_TOKEN_KEY);
      
      // Nếu không authenticated hoặc không có token, redirect về login
      if (!isAuthenticated || !token) {
        console.log('⚠️ ~ Not authenticated or no token, redirecting to login');
        throw redirect(pathRoutes.login);
      }
      
      // Kiểm tra nếu không phải page reload và đã có data trong store
      if (!isPageReload()) {
        console.log('📋 ~ Not a page reload, checking store');
        const { userLogin, menuData } = useConfigAppStore.getState();
        if (!isEmpty(userLogin) && !isEmpty(menuData)) {
          console.log('✅ ~ Using data from store');
          return {
            profile: userLogin,
            menus: menuData,
          };
        }
      }
      
      console.log('🔄 ~ Calling globalService.initApp()');
      try {
      const result = await globalService.initApp();
      console.log('🚀 ~ routers ~ result:', result);
      console.log('📤 ~ Router loader returning:', {
        profile: result.profile ? 'loaded' : 'empty',
        menus: Array.isArray(result.menus) ? `${result.menus.length} items` : 'not array',
        params: result.params ? 'loaded' : 'empty'
      });
      
      useConfigAppStore.getState().setInitApp(result);
      return result;
      } catch (error) {
        console.error('❌ ~ Router loader error:', error);
        // Nếu có lỗi, vẫn trả về empty data thay vì redirect
        // để tránh loop redirect
        return {
          profile: {} as any,
          menus: [],
          params: {},
        };
      }
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

      const { isAuthenticated } = useConfigAppStore.getState();

      if (isAuthenticated) {
        throw redirect(pathRoutes.welcome);
      }

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
], {
  basename: '/admin'
});
