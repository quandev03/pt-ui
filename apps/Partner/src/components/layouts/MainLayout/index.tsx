import { FC, PropsWithChildren } from 'react';
import LayoutDashboard from '../AuthLayout';

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return <LayoutDashboard>{children}</LayoutDashboard>;
};

export default MainLayout;
