import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { Spin } from 'antd';
import { compact } from 'lodash';
import { ReactElement, useCallback, useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSupportGetMenu } from '../components/layouts/queryHooks';
import useConfigAppStore from '../components/layouts/store';
import useConfigAppNoPersistStore from '../components/layouts/store/useConfigAppNoPersistStore';
import { pathRoutes } from '../constants/routes';
import ForgotPassword from '../modules/Auth/pages/ForgotPassword';
import LoginPage from '../modules/Auth/pages/Login';
import NotFoundPage from '../modules/NotFound/page';
import PersonalInfoPage from '../modules/PersonalInfo/pages';
import WelcomePage from '../modules/WelcomePage';
import ProtectedRoute from './ProtectedRoute';
import { routes } from './routes';

const Router = () => {
  const { urlsActive, setUrlsActive } = useConfigAppNoPersistStore();
  const { isAuthenticated } = useConfigAppStore();
  const { data: menuData = [], isFetching } =
    useSupportGetMenu(isAuthenticated);

  const genRoutes = useCallback(
    (urlsActive: string[], routes: any[], action: ActionsTypeEnum) => {
      routes.forEach((e) => {
        const props = (e?.page as ReactElement)?.props;
        switch (action) {
          case ActionsTypeEnum.CREATE:
            if (
              props?.actionMode === ActionsTypeEnum.CREATE ||
              props?.actionType === ActionType.ADD
            )
              urlsActive.push(e.path);
            break;
          case ActionsTypeEnum.READ:
            if (
              props?.actionMode === ActionsTypeEnum.READ ||
              props?.actionType === ActionType.VIEW
            )
              urlsActive.push(e.path);
            break;
          case ActionsTypeEnum.UPDATE:
            if (
              props?.actionMode === ActionsTypeEnum.UPDATE ||
              props?.actionType === ActionType.EDIT
            )
              urlsActive.push(e.path);
            break;
          case ActionsTypeEnum.COPY:
            if (props?.actionType === ActionsTypeEnum.COPY)
              urlsActive.push(e.path);
            break;
        }
      });
    },
    []
  );
  useEffect(() => {
    if (!menuData.length) return;
    const allUrlsActive: string[] = [];
    menuData.forEach((item) => {
      allUrlsActive.push(item.uri);
      const activeRoutes = routes.filter((e) => e.path?.startsWith(item.uri));
      if (item.actions?.includes(ActionsTypeEnum.CREATE)) {
        allUrlsActive.push(item.uri + '/add');
        genRoutes(allUrlsActive, activeRoutes, ActionsTypeEnum.CREATE);
      }
      if (item.actions?.includes(ActionsTypeEnum.READ)) {
        allUrlsActive.push(item.uri + '/view/:id');
        genRoutes(allUrlsActive, activeRoutes, ActionsTypeEnum.READ);
      }
      if (item.actions?.includes(ActionsTypeEnum.UPDATE)) {
        allUrlsActive.push(item.uri + '/edit/:id');
        genRoutes(allUrlsActive, activeRoutes, ActionsTypeEnum.UPDATE);
      }
      if (item.actions?.includes(ActionsTypeEnum.COPY)) {
        allUrlsActive.push(item.uri + '/copy/:id');
      }
      if (item.uri === '/partner-limits') {
        allUrlsActive.push(item.uri + '/debt-detail/:id');
      }
    });
    setUrlsActive(compact(allUrlsActive));
  }, [menuData, setUrlsActive, isAuthenticated, genRoutes]);

  const currentRoutes = useMemo(() => {
    const result = routes.filter((value) => {
      return urlsActive?.some((v: string) => value.path === v);
    });
    result.push(
      {
        path: pathRoutes.welcome,
        page: <WelcomePage />,
      },
      {
        path: '/',
        page: <WelcomePage />,
      },
      {
        path: '/profile',
        page: <PersonalInfoPage />,
      }
    );
    return result;
  }, [urlsActive, isAuthenticated]);

  if (isFetching && !urlsActive.length) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spin />
      </div>
    );
  }
  return (
    <Routes>
      {currentRoutes?.map((item, index) => {
        return (
          <Route
            path={item.path}
            key={index}
            element={<ProtectedRoute element={item.page} />}
          />
        );
      })}
      <Route path={pathRoutes.login} element={<LoginPage />} />
      <Route path={pathRoutes.forgotPassword} element={<ForgotPassword />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;
