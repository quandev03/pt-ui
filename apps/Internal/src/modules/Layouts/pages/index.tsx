import {
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
  const {
    userLogin,
    collapsedMenu,
    toggleCollapsedMenu,
    showChangePassModal,
    setShowChangePassModal,
    logoutStore,
    isAuthenticated,
    menuData,
  } = useConfigAppStore();
  console.log('isAuthenticated', isAuthenticated);
  console.log('menus', menuData);
  return (
    <LayoutPageCommon
      pathRoutes={pathRoutes}
      isAuthenticated={isAuthenticated}
      routerItems={routerItems}
      menuData={menuData}
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
