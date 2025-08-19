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
  const { menus } = useGetLoaderData();
  const {
    userLogin,
    collapsedMenu,
    toggleCollapsedMenu,
    showChangePassModal,
    setShowChangePassModal,
    logoutStore,
    isAuthenticated,
  } = useConfigAppStore();
  console.log('isAuthenticated', isAuthenticated);
  return (
    <LayoutPageCommon
      pathRoutes={pathRoutes}
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
