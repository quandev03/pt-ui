import { useMemo } from 'react';
import { Navigate, Outlet, useLocation, useNavigation } from 'react-router-dom';
import { useActionMode, usePermissions } from '../../hooks';
import { IPathRoutes, MenuObjectItem } from '../../types';
import { Loader } from './Loader';

interface INavigationLoaderProps {
  menuData: MenuObjectItem[];
  pathRoutes: IPathRoutes;
}

export const NavigationLoader = ({
  menuData,
  pathRoutes,
}: INavigationLoaderProps) => {
  const navigation = useNavigation();
  const action = useActionMode();
  const { pathname } = useLocation();
  const routeDefaultWhenLogin = useMemo(() => {
    return [pathRoutes.profile, pathRoutes.welcome];
  }, [pathRoutes]);
  const permissionsFromCurrentUri = usePermissions(menuData);
  console.log(
    '🚀 ~ NavigationLoader ~ permissionsFromCurrentUri:',
    permissionsFromCurrentUri
  );

  const hasPermission = useMemo(() => {
    if (pathname === pathRoutes.welcome) return true;
    return permissionsFromCurrentUri.hasPermission(action);
  }, [pathname, pathRoutes.welcome, permissionsFromCurrentUri, action]);

  // Hiển thị loading khi đang navigate
  if (navigation.state === 'loading') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  } else if (!hasPermission && !routeDefaultWhenLogin.includes(pathname)) {
    return <Navigate to={pathRoutes.welcome} />;
  }
  return <Outlet />;
};
