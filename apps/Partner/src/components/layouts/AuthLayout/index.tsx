import { Col, Layout, Row, Spin } from 'antd';
import { FC, PropsWithChildren, Suspense, memo } from 'react';
import LoadingLazy from '../../../../../../commons/src/lib/commons/LoadingLazy';
import BreadcrumbComponent from './components/Breadcrumb';
import LeftHeader from './components/LeftHeader';
import LeftMenu from './components/LeftMenu';
import ModalChangePassword from './components/ModalChangePassword';
import Profile from './components/Profile';
import { FallbackSpin, HeaderAccount, StyledLayout } from './styled';
import useConfigAppStore from '../store';
import { useGetParamsOption, useGetProfile } from '../queryHooks';

const { Header, Content } = Layout;

const LayoutDashboard: FC<PropsWithChildren> = memo(({ children }) => {
  const { isAuthenticated } = useConfigAppStore();
  const { isFetching: loadingParamsOption } =
    useGetParamsOption(isAuthenticated);
  const { isFetching: loadingProfile } = useGetProfile(isAuthenticated);

  return (
    <StyledLayout>
      <LeftMenu />
      <Layout className="site-layout">
        <Header className="p-0 h-[42px] bg-[#f8f8f8]">
          <Row justify="space-between">
            <Col>
              <LeftHeader />
              <BreadcrumbComponent />
            </Col>
            <Col>
              <HeaderAccount>
                <Profile />
              </HeaderAccount>
            </Col>
          </Row>
        </Header>
        <Content className="p-7 pt-0 min-h-72 overflow-auto bg-[#f8f8f8]">
          {loadingParamsOption || loadingProfile ? (
            <Spin spinning={loadingParamsOption || loadingProfile}></Spin>
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
