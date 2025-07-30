import { Col, Layout, Row } from 'antd';
import { memo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemesType } from '../../../constants';
import {
  ILayoutService,
  IPathRoutes,
  IUserInfo,
  MenuObjectItem,
  RouterItems,
} from '../../../types';
import { NavigationLoader } from '../../NavigationLoader';
import {
  BreadcrumbComponent,
  LeftHeader,
  LeftMenu,
  ModalChangePassword,
  Profile,
} from '../components';
import { HeaderAccount, StyledLayout } from '../styled';

const { Header, Content } = Layout;

export interface ParamsType {
  id?: string | number;
}

interface ILayoutPageProps {
  pathRoutes: IPathRoutes;
  isAuthenticated: boolean;
  routerItems: RouterItems[];
  menuData: MenuObjectItem[];
  specialActions: string[];
  singlePopActions: string[];
  doublePopActions: string[];
  LayoutService: ILayoutService;
  themeConfig: ThemesType;
  collapsedMenu: boolean;
  toggleCollapsedMenu: () => void;
  showChangePassModal: boolean;
  setShowChangePassModal: (value: boolean) => void;
  userLogin: IUserInfo | null;
  logoutStore: () => void;
}

export const LayoutPageCommon: React.FC<ILayoutPageProps> = memo(
  ({
    pathRoutes,
    isAuthenticated,
    routerItems,
    menuData,
    specialActions,
    singlePopActions,
    doublePopActions,
    LayoutService,
    themeConfig,
    collapsedMenu,
    toggleCollapsedMenu,
    showChangePassModal,
    setShowChangePassModal,
    userLogin,
    logoutStore,
  }) => {
    const { pathname, search } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate(pathRoutes.login as string, {
          state: {
            pathname: pathname,
            search: search,
          },
        });
      }
    }, [isAuthenticated, pathname, search, navigate, pathRoutes.login]);

    return (
      <StyledLayout>
        <LeftMenu
          routerItems={routerItems}
          specialActions={specialActions}
          singlePopActions={singlePopActions}
          doublePopActions={doublePopActions}
          LayoutService={LayoutService}
          themeConfig={themeConfig}
          collapsedMenu={collapsedMenu}
          toggleCollapsedMenu={toggleCollapsedMenu}
        />
        <Layout className="site-layout">
          <Header className="h-auto border-b border-[#E5E7EB] !bg-[#FFF] !p-0 min-h-[72px]">
            <Row justify="space-between" align="middle" className="h-full">
              <Col>
                <LeftHeader
                  collapsedMenu={collapsedMenu}
                  toggleCollapsedMenu={toggleCollapsedMenu}
                />
                <BreadcrumbComponent routerItems={routerItems} />
              </Col>
              <Col>
                <HeaderAccount>
                  <Profile
                    pathRoutes={pathRoutes}
                    logoutStore={logoutStore}
                    userLogin={userLogin}
                    setShowChangePassModal={setShowChangePassModal}
                  />
                </HeaderAccount>
              </Col>
            </Row>
          </Header>
          <Content className="min-h-72 overflow-auto bg-[#f8f8f8] p-6 !pt-2">
            <NavigationLoader menuData={menuData} pathRoutes={pathRoutes} />
          </Content>
        </Layout>
        <ModalChangePassword
          userLogin={userLogin}
          logoutStore={logoutStore}
          fetcherChangePassword={LayoutService.fetcherChangePassword}
          showChangePassModal={showChangePassModal}
          setShowChangePassModal={setShowChangePassModal}
        />
      </StyledLayout>
    );
  }
);
