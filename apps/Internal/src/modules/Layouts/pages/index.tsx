import {
  AnyElement,
  LayoutPageCommon,
  themeConfig,
  useGetLoaderData,
} from '@vissoft-react/common';
import {
  doublePopActions,
  pathRoutes,
  routerItems,
  singlePopActions,
  specialActions,
} from '../../../routers';
import { layoutPageService } from '../services';
import useConfigAppStore from '../stores';

export const LayoutPage = () => {
  console.log('🏠 ~ LayoutPage rendered');
  const loaderData = useGetLoaderData();
  console.log('📥 ~ useGetLoaderData result:', loaderData);
  const { menus } = loaderData;
  
  const {
    userLogin,
    collapsedMenu,
    toggleCollapsedMenu,
    showChangePassModal,
    setShowChangePassModal,
    logoutStore,
    isAuthenticated,
  } = useConfigAppStore();
  console.log('🔐 ~ isAuthenticated:', isAuthenticated);
  console.log('👤 ~ userLogin:', userLogin ? 'logged in' : 'not logged in');
  console.log('📋 ~ menus from loader:', menus, 'type:', typeof menus, 'isArray:', Array.isArray(menus));
  return (
    <LayoutPageCommon
      pathRoutes={pathRoutes as AnyElement}
      isAuthenticated={isAuthenticated}
      routerItems={routerItems}
      menuData={menus}
      specialActions={specialActions}
      singlePopActions={singlePopActions}
      doublePopActions={doublePopActions}
      LayoutService={layoutPageService}
      themeConfig={themeConfig}
      collapsedMenu={collapsedMenu}
      toggleCollapsedMenu={toggleCollapsedMenu}
      showChangePassModal={showChangePassModal}
      setShowChangePassModal={setShowChangePassModal}
      userLogin={userLogin}
      logoutStore={logoutStore}
    />
  );
};
