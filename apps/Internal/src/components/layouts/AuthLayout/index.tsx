import { Col, Layout, Row, Spin } from 'antd';
import ModalChangePassword from 'apps/Internal/src/components/layouts/AuthLayout/components/ModalChangePassword';
import { useSupportInitFcm } from 'apps/Internal/src/modules/Auth/queryHooks';
import { FC, memo, PropsWithChildren, Suspense, useEffect } from 'react';
import LoadingLazy from '../../../../../../commons/src/lib/commons/LoadingLazy';
import useConfigAppStore from '../store';
import BreadcrumbComponent from './components/Breadcrumb';
import LeftHeader from './components/LeftHeader';
import LeftMenu from './components/LeftMenu';
import Notification from './components/Notification';
import Profile from './components/Profile';
import { FallbackSpin, HeaderAccount, StyledLayout } from './styled';
import { useGetParamsOption, useGetProfile } from '../queryHooks';

const { Header, Content } = Layout;

const LayoutDashboard: FC<PropsWithChildren> = memo(({ children }) => {
  const { isAuthenticated } = useConfigAppStore();
  const { isFetching: loadingParams } = useGetParamsOption(isAuthenticated);
  const { isFetching: loadingProfile } = useGetProfile(isAuthenticated);
  const { mutate: initFcm } = useSupportInitFcm();

  useEffect(() => {
    if (isAuthenticated) {
      initFcm();
      console.log('Initialized FCM!');
    } else {
      console.log('Unauthenticated, ignore FCM!');
    }
  }, []);

  return (
    <StyledLayout>
      <LeftMenu />
      <Layout className="site-layout">
        <Header className="p-0 h-auto bg-[#f8f8f8]">
          <Row
            justify="space-between"
            className="min-h-[50px] flex items-center "
          >
            <Col>
              <LeftHeader />
              <BreadcrumbComponent />
            </Col>
            <Col>
              <HeaderAccount>
                <Notification />
                <Profile />
              </HeaderAccount>
            </Col>
          </Row>
        </Header>
        <Content className="px-7 pb-[7px] pt-0 min-h-72 overflow-auto bg-[#f8f8f8]">
          {loadingParams || loadingProfile ? (
            <Spin spinning={loadingParams || loadingProfile}></Spin>
          ) : (
            <Suspense
              fallback={
                <FallbackSpin>
                  <LoadingLazy />
                </FallbackSpin>
              }
            >
              {children}
            </Suspense>
          )}
        </Content>
      </Layout>
      <ModalChangePassword />
    </StyledLayout>
  );
});

export default LayoutDashboard;
